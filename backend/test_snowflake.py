from app.database.snowflake import get_snowflake_connection


try:
    conn = get_snowflake_connection()

    cursor = conn.cursor()

    cursor.execute("SELECT CURRENT_DATABASE(), CURRENT_SCHEMA(), CURRENT_ROLE();")

    result = cursor.fetchone()

    print("SNOWFLAKE CONNECTED ✅")
    print(result)

    cursor.close()
    conn.close()

except Exception as e:
    print("CONNECTION FAILED ❌")
    print(e)