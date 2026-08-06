from database_snowflake.connection import get_snowflake_connection


def save_production_result(parser_result):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        rows = parser_result["data"]

        inserted = 0

        for row in rows:

            # skip instruksi/header
            if not isinstance(row.get("DATA HASIL PRODUKSI"), int):
                continue

            cursor.execute(
                """
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
                """,
                (
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
                ),
            )

            inserted += 1

        conn.commit()

        return {"status": "success", "inserted_rows": inserted}

    except Exception as e:

        conn.rollback()

        return {"status": "failed", "error": str(e)}

    finally:

        cursor.close()
        conn.close()
