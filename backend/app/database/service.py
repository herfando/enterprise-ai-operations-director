from app.database.snowflake import get_snowflake_connection


def execute_query(sql: str):

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(sql)

        result = cursor.fetchone()

    print(result)

if result is None:

    raise Exception("AI_PARSE_DOCUMENT gagal.")

        return result[0]

    finally:

        cursor.close()
        conn.close()

            item = {}

            for col, value in zip(columns, row):

                item[col] = value

            result.append(item)

        return result

    finally:

        cursor.close()
        conn.close()