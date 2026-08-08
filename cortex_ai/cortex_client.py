import json

from cortex_ai.connection import get_cortex_connection


def call_cortex_ai(prompt: str):
    """
    Mengirim prompt ke Snowflake Cortex AI
    dan mengembalikan hasil sebagai string.
    """

    conn = get_cortex_connection()
    cursor = conn.cursor()

    try:
        safe_prompt = prompt.replace("'", "''")

        sql = f"""
        SELECT SNOWFLAKE.CORTEX.COMPLETE(
            'mistral-large2',
            '{safe_prompt}'
        )
        """

        cursor.execute(sql)

        result = cursor.fetchone()

        if not result:
            raise Exception("Cortex tidak mengembalikan hasil.")

        response = result[0]

        # Cortex biasanya mengembalikan JSON/string.
        if isinstance(response, str):
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return response

        return response

    finally:
        cursor.close()
        conn.close()
