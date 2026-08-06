# backend/services/cortex_service.py

import json

from backend.services.snowflake_service import upload_to_stage, execute_query

STAGE_NAME = "@AI_OPERATIONS.AI_CONFIG.DOCUMENT_STAGE"


def parse_document_with_cortex(file_path, filename):

    # 1. masukkan file ke Snowflake Stage
    upload_to_stage(file_path)

    safe_filename = filename.replace("'", "''")

    # 2. panggil Cortex AI_PARSE_DOCUMENT
    sql = f"""
    SELECT AI_PARSE_DOCUMENT(
        TO_FILE(
            '{STAGE_NAME}',
            '{safe_filename}'
        )
    )
    """

    result = execute_query(sql)

    if result is None:

        raise Exception("Cortex tidak mengembalikan hasil")

    data = result[0]

    # Cortex bisa return string JSON
    if isinstance(data, str):

        try:

            data = json.loads(data)

        except json.JSONDecodeError:

            data = {"content": data}

    return data
