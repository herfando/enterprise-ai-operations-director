from database_snowflake.connection import get_snowflake_connection


def save_production_result(parser_result):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        rows = parser_result["data"]

        inserted = 0
        skipped = 0

        # =====================================================
        # DUPLICATE CHECK
        # =====================================================

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
                %s,%s,%s,%s,
                %s,%s,%s,%s,
                %s,%s,%s,%s,
                %s,%s,%s,%s
            )
        """

        # =====================================================
        # PROCESS ROWS
        # =====================================================

        for row in rows:

            # Skip instruksi/header
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

            # =================================================
            # CHECK DATABASE
            # =================================================

            cursor.execute(check_sql, values)

            result = cursor.fetchone()

            existing_count = result[0] if result else 0

            if existing_count > 0:

                skipped += 1
                continue

            # =================================================
            # INSERT NEW RECORD
            # =================================================

            cursor.execute(insert_sql, values)

            inserted += 1

        conn.commit()

        return {
            "status": "success",
            "inserted_rows": inserted,
            "skipped_duplicates": skipped,
        }

    except Exception as e:

        conn.rollback()

        return {
            "status": "failed",
            "error": str(e),
        }

    finally:

        cursor.close()
        conn.close()
