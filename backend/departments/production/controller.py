from database_snowflake.connection import get_snowflake_connection

from backend.departments.production.rules import validate_production_document

from cortex_ai.prompts.production import build_production_decision_prompt
from cortex_ai.cortex_client import call_cortex_ai

import json

# =====================================================
# SAVE PRODUCTION RESULT
# =====================================================


def save_production_result(parser_result):

    # -------------------------------------------------
    # VALIDATE PRODUCTION DOCUMENT
    # -------------------------------------------------

    validation = validate_production_document(parser_result)

    if not validation["valid"]:

        return validation

    # -------------------------------------------------
    # DATABASE CONNECTION
    # -------------------------------------------------

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        rows = parser_result["data"]

        inserted = 0
        skipped = 0

        # -------------------------------------------------
        # DUPLICATE CHECK
        # -------------------------------------------------

        check_sql = """
            SELECT COUNT(*)
            FROM DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT
            WHERE
                START_PRODUCTION = %s
                AND FINISH_PRODUCTION = %s
                AND MACHINE_NAME = %s
                AND PRODUCT_NAME = %s
                AND TOTAL_PLANNING = %s
                AND TOTAL_PRODUCTION = %s
                AND GOOD_PRODUCT = %s
                AND REJECT_PRODUCT = %s
                AND DOWNTIME_MINUTES = %s
                AND MATERIAL_NAME = %s
                AND MATERIAL_USAGE_KG = %s
                AND MATERIAL_REMAINING_KG = %s
                AND OPERATOR_NAME = %s
                AND SHIFT_OPERATOR = %s
                AND OPERATOR_GROUP = %s
                AND TARGET_STATUS = %s
        """

        # -------------------------------------------------
        # INSERT SQL
        # -------------------------------------------------

        insert_sql = """
            INSERT INTO DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT
            (
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
            )
            VALUES
            (
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s
            )
        """

        # -------------------------------------------------
        # PROCESS EACH ROW
        # -------------------------------------------------

        for row in rows:

            # Skip header / instruction rows

            if not isinstance(row.get("DATA HASIL PRODUKSI"), int):
                continue

            values = (
                row["Unnamed: 1"],
                row["Unnamed: 2"],
                row["Unnamed: 3"],
                row["Unnamed: 4"],
                row["Unnamed: 5"],
                row["Unnamed: 6"],
                row["Unnamed: 7"],
                row["Unnamed: 8"],
                row["Unnamed: 9"],
                row["Unnamed: 10"],
                row["Unnamed: 11"],
                row["Unnamed: 12"],
                row["Unnamed: 13"],
                row["Unnamed: 14"],
                row["Unnamed: 15"],
                row["Unnamed: 16"],
            )

            # -------------------------------------------------
            # CHECK IDENTICAL RECORD
            # -------------------------------------------------

            cursor.execute(check_sql, values)

            result = cursor.fetchone()

            existing_count = result[0] if result else 0

            # -------------------------------------------------
            # SKIP DUPLICATE
            # -------------------------------------------------

            if existing_count > 0:

                skipped += 1

                continue

            # -------------------------------------------------
            # INSERT NEW RECORD
            # -------------------------------------------------

            cursor.execute(insert_sql, values)

            inserted += 1

        # -------------------------------------------------
        # COMMIT
        # -------------------------------------------------

        conn.commit()

        return {
            "status": "success",
            "inserted_rows": inserted,
            "skipped_duplicates": skipped,
            "total_processed": (inserted + skipped),
        }

    # -------------------------------------------------
    # DATABASE ERROR
    # -------------------------------------------------

    except Exception as e:

        conn.rollback()

        return {
            "status": "failed",
            "error": str(e),
        }

    # -------------------------------------------------
    # CLOSE CONNECTION
    # -------------------------------------------------

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

    # -------------------------------------------------
    # INSERT AI DECISION
    # -------------------------------------------------

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
            json.dumps(
                decision_data.get(
                    "evidence",
                    [],
                )
            ),
            decision_data.get("business_impact"),
            json.dumps(
                decision_data.get(
                    "immediate_actions",
                    [],
                )
            ),
            json.dumps(
                decision_data.get(
                    "follow_up_actions",
                    [],
                )
            ),
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
