from datetime import date

from fastapi import APIRouter, Query

from database_snowflake.connection import get_snowflake_connection

router = APIRouter(prefix="/production", tags=["Production Dashboard"])


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
        "availability": round(availability, 2),
        "performance": round(performance, 2),
        "quality": round(quality, 2),
        "oee": round(oee, 2),
        "yield": round(yield_percent, 2),
    }


# =====================================================
# GROUPING
# =====================================================


def group_production(rows, index):

    result = {}

    for row in rows:

        key = row[index]

        if key not in result:

            result[key] = 0

        result[key] += row[5] or 0

    return result


# =====================================================
# PARETO ENGINE
# =====================================================


def create_pareto(data):

    sorted_data = sorted(data.items(), key=lambda x: x[1], reverse=True)

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
                "percentage": round(percentage, 2),
                "cumulative_percentage": round(cumulative, 2),
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

            machines[machine] = {"planning": 0, "production": 0}

        machines[machine]["planning"] += row[4] or 0

        machines[machine]["production"] += row[5] or 0

    result = {}

    for machine, data in machines.items():

        achievement = 0

        if data["planning"] > 0:

            achievement = (data["production"] / data["planning"]) * 100

        result[machine] = round(achievement, 2)

    return result


# =====================================================
# DASHBOARD ENDPOINT
# =====================================================


@router.get("/dashboard")
def production_dashboard(start_date: date = Query(...), end_date: date = Query(...)):

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

            return {"status": "empty", "message": "No production data"}

        production_machine = group_production(rows, 2)

        production_operator = group_production(rows, 12)

        production_shift = group_production(rows, 13)

        production_group = group_production(rows, 14)

        production_product = group_production(rows, 3)

        material_usage = {}

        for row in rows:

            material = row[9]

            if material not in material_usage:

                material_usage[material] = 0

            material_usage[material] += row[10] or 0

        downtime_machine = {}

        for row in rows:

            machine = row[2]

            downtime_machine[machine] = downtime_machine.get(machine, 0) + (row[8] or 0)

        reject_product = {}

        for row in rows:

            product = row[3]

            reject_product[product] = reject_product.get(product, 0) + (row[7] or 0)

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
            "production_by_machine": create_pareto(production_machine),
            "production_by_operator": create_pareto(production_operator),
            "production_by_shift": create_pareto(production_shift),
            "production_by_group": create_pareto(production_group),
            "production_by_product": create_pareto(production_product),
            "material_by_name": create_pareto(material_usage),
            "pareto": {
                "downtime_machine": create_pareto(downtime_machine),
                "reject_product": create_pareto(reject_product),
                "machine_achievement": create_pareto(machine_achievement(rows)),
            },
        }

    finally:

        cursor.close()

        conn.close()
