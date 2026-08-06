# backend/services/snowflake_service.py

import os

from database_snowflake.connection import get_snowflake_connection

STAGE_NAME = "@AI_OPERATIONS.AI_CONFIG.DOCUMENT_STAGE"


def upload_to_stage(file_path):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        absolute_path = os.path.abspath(file_path)

        sql = """
        PUT %s
        @AI_OPERATIONS.AI_CONFIG.DOCUMENT_STAGE
        AUTO_COMPRESS=FALSE
        OVERWRITE=TRUE
        """

        cursor.execute(sql, ("file://" + absolute_path,))

        return cursor.fetchall()

    finally:
        cursor.close()
        conn.close()


def execute_query(sql):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        cursor.execute(sql)

        return cursor.fetchone()

    finally:

        cursor.close()
        conn.close()
