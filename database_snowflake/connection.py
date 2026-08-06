import os
from pathlib import Path

import snowflake.connector
from dotenv import load_dotenv

# ambil .env dari folder backend
BASE_DIR = Path(__file__).resolve().parent.parent

ENV_PATH = BASE_DIR / "backend" / ".env"

load_dotenv(ENV_PATH)


def get_snowflake_connection():

    return snowflake.connector.connect(
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PASSWORD"),
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA"),
        role=os.getenv("SNOWFLAKE_ROLE"),
    )
