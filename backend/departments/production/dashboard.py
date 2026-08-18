from datetime import date

from fastapi import APIRouter, Query

from database_snowflake.connection import get_snowflake_connection

from cortex_ai.prompts.production import build_production_decision_prompt
from cortex_ai.cortex_client import call_cortex_ai
import json

router = APIRouter(
    prefix="/production",
    tags=["Production Dashboard"],
)


# =====================================================
# OEE CALCULATION
# =====================================================


def calculate_oee(rows):

    total_planning = 0
    total_production = 0
    total_good = 0

    availability_values = []

    for row in rows:

        (
            start_production,
            finish_production,
            machine_name,
            product_name,
            total_plan,
            total_prod,
            good_product,
            reject_product,
            downtime,
            material_name,
            material_usage,
            material_remaining,
            operator_name,
            shift_operator,
            operator_group,
            target_status,
        ) = row

        total_planning += total_plan or 0
        total_production += total_prod or 0
        total_good += good_product or 0

        if start_production and finish_production:

            production_minutes = (
                finish_production - start_production
            ).total_seconds() / 60

            planned_minutes = production_minutes + (downtime or 0)

            if planned_minutes > 0:

                availability = (production_minutes / planned_minutes) * 100

                availability_values.append(availability)

    quality = 0

    if total_production > 0:

        quality = (total_good / total_production) * 100

    performance = 0

    if total_planning > 0:

        performance = (total_production / total_planning) * 100

    yield_percent = 0

    if total_planning > 0:

        yield_percent = (total_good / total_planning) * 100

    availability = 0

    if availability_values:

        availability = sum(availability_values) / len(availability_values)

    oee = (availability * performance * quality) / 10000

    return {
        "availability": round(
            availability,
            2,
        ),
        "performance": round(
            performance,
            2,
        ),
        "quality": round(
            quality,
            2,
        ),
        "oee": round(
            oee,
            2,
        ),
        "yield": round(
            yield_percent,
            2,
        ),
    }


# =====================================================
# GROUPING
# =====================================================


def group_sum(rows, key_index, value_index):

    result = {}

    for row in rows:

        key = row[key_index]

        if key is None:
            key = "Unknown"

        result[key] = result.get(key, 0) + (row[value_index] or 0)

    return result


# =====================================================
# PARETO ENGINE
# =====================================================


def create_pareto(data):

    sorted_data = sorted(
        data.items(),
        key=lambda x: x[1],
        reverse=True,
    )

    total = sum(value for _, value in sorted_data)

    result = []

    cumulative = 0

    for name, value in sorted_data:

        percentage = 0

        if total > 0:

            percentage = (value / total) * 100

        cumulative += percentage

        result.append(
            {
                "name": name,
                "value": value,
                "percentage": round(
                    percentage,
                    2,
                ),
                "cumulative_percentage": round(
                    cumulative,
                    2,
                ),
            }
        )

    return result


# =====================================================
# MACHINE ACHIEVEMENT
# =====================================================


def machine_achievement(rows):

    machines = {}

    for row in rows:

        machine = row[2]

        if machine not in machines:

            machines[machine] = {
                "planning": 0,
                "production": 0,
            }

        machines[machine]["planning"] += row[4] or 0

        machines[machine]["production"] += row[5] or 0

    result = {}

    for machine, data in machines.items():

        achievement = 0

        if data["planning"] > 0:

            achievement = (data["production"] / data["planning"]) * 100

        result[machine] = round(
            achievement,
            2,
        )

    return result


# =====================================================
# DASHBOARD ENDPOINT
# =====================================================


@router.get("/dashboard")
def production_dashboard(
    start_date: date = Query(...),
    end_date: date = Query(...),
):

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(f"""
            SELECT

            START_PRODUCTION,
            FINISH_PRODUCTION,
            MACHINE_NAME,
            PRODUCT_NAME,
            TOTAL_PLANNING,
            TOTAL_PRODUCTION,
            GOOD_PRODUCT,
            REJECT_PRODUCT,
            DOWNTIME_MINUTES,
            MATERIAL_NAME,
            MATERIAL_USAGE_KG,
            MATERIAL_REMAINING_KG,
            OPERATOR_NAME,
            SHIFT_OPERATOR,
            OPERATOR_GROUP,
            TARGET_STATUS

            FROM DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT

            WHERE START_PRODUCTION::DATE
            BETWEEN '{start_date}'
            AND '{end_date}'
            """)

        rows = cursor.fetchall()

        if not rows:

            return {
                "status": "empty",
                "message": "No production data",
            }

        downtime_by_machine = group_sum(
            rows,
            2,
            8,
        )

        reject_by_machine = group_sum(
            rows,
            2,
            7,
        )

        reject_by_product = group_sum(
            rows,
            3,
            7,
        )

        reject_by_operator = group_sum(
            rows,
            12,
            7,
        )

        reject_by_group = group_sum(
            rows,
            14,
            7,
        )

        reject_by_shift = group_sum(
            rows,
            13,
            7,
        )

        reject_by_material = group_sum(
            rows,
            9,
            7,
        )

        material_usage = {}

        for row in rows:

            material = row[9]

            if material not in material_usage:

                material_usage[material] = 0

            material_usage[material] += row[10] or 0

        return {
            "start_date": str(start_date),
            "end_date": str(end_date),
            "summary": {
                "total_planning": sum(row[4] or 0 for row in rows),
                "total_production": sum(row[5] or 0 for row in rows),
                "good_product": sum(row[6] or 0 for row in rows),
                "reject_product": sum(row[7] or 0 for row in rows),
                "total_material_usage_kg": sum(row[10] or 0 for row in rows),
            },
            "oee": calculate_oee(rows),
            "pareto": {
                "downtime_by_machine": create_pareto(downtime_by_machine),
                "reject_by_machine": create_pareto(reject_by_machine),
                "reject_by_product": create_pareto(reject_by_product),
                "reject_by_operator": create_pareto(reject_by_operator),
                "reject_by_group": create_pareto(reject_by_group),
                "reject_by_shift": create_pareto(reject_by_shift),
                "reject_by_material": create_pareto(reject_by_material),
            },
        }

    finally:

        cursor.close()

        conn.close()


# =====================================================
# SAVE AI DECISION
# =====================================================


def save_ai_decision(
    decision_data,
    department,
    start_date,
    end_date,
):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    insert_sql = """
        INSERT INTO DATABASE_SNOWFLAKE.AI_DECISIONS.AI_DECISIONS
        (
            DEPARTMENT,
            START_DATE,
            END_DATE,
            TITLE,
            SEVERITY,
            PRIORITY,
            CONFIDENCE,
            EXECUTIVE_SUMMARY,
            PRIMARY_PROBLEM,
            WHY_FIRST,
            EVIDENCE,
            BUSINESS_IMPACT,
            IMMEDIATE_ACTIONS,
            FOLLOW_UP_ACTIONS,
            RECOMMENDATION,
            EXPECTED_IMPACT
        )
        VALUES
        (
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s
        )
    """

    try:

        values = (
            department,
            start_date,
            end_date,
            decision_data.get("title"),
            decision_data.get("severity"),
            decision_data.get("priority"),
            decision_data.get("confidence"),
            decision_data.get("executive_summary"),
            decision_data.get("primary_problem"),
            decision_data.get("why_first"),
            json.dumps(decision_data.get("evidence", [])),
            decision_data.get("business_impact"),
            json.dumps(decision_data.get("immediate_actions", [])),
            json.dumps(decision_data.get("follow_up_actions", [])),
            decision_data.get("recommendation"),
            decision_data.get("expected_impact"),
        )

        cursor.execute(
            insert_sql,
            values,
        )

        conn.commit()

        return {
            "status": "success",
        }

    except Exception as e:

        conn.rollback()

        print(
            "Failed to save AI decision:",
            e,
        )

        return {
            "status": "failed",
            "error": str(e),
        }

    finally:

        cursor.close()
        conn.close()


# =====================================================
# AI PRODUCTION DECISION
# =====================================================


@router.get("/decision")
def production_decision(
    start_date: date = Query(...),
    end_date: date = Query(...),
):

    # =================================================
    # GET PROCESSED DASHBOARD DATA
    # =================================================

    dashboard_data = production_dashboard(
        start_date=start_date,
        end_date=end_date,
    )

    if dashboard_data.get("status") == "empty":

        return {
            "status": "empty",
            "message": ("No production data " "available for AI decision."),
        }

    # =================================================
    # BUILD AI PROMPT
    # =================================================

    prompt = build_production_decision_prompt(dashboard_data)

    # =================================================
    # CALL CORTEX AI
    # =================================================

    ai_result = call_cortex_ai(prompt)

    # =================================================
    # CONVERT CORTEX RESPONSE TO DICT
    # =================================================

    if isinstance(ai_result, str):

        ai_result = ai_result.strip()

        if ai_result.startswith("```json"):

            ai_result = ai_result[7:]

        elif ai_result.startswith("```"):

            ai_result = ai_result[3:]

        if ai_result.endswith("```"):

            ai_result = ai_result[:-3]

        ai_result = ai_result.strip()

        ai_result = json.loads(ai_result)

    # =================================================
    # SAVE AI DECISION TO SNOWFLAKE
    # =================================================

    ai_save_result = save_ai_decision(
        decision_data=ai_result,
        department="Production",
        start_date=start_date,
        end_date=end_date,
    )

    # =================================================
    # RETURN TO FRONTEND
    # =================================================

    return {
        "status": "success",
        "department": "Production",
        "start_date": str(start_date),
        "end_date": str(end_date),
        "decision": ai_result,
        "ai_database": ai_save_result,
    }
