import os

from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL = (
    f"snowflake://"
    f"{os.getenv('SNOWFLAKE_USER')}:"
    f"{os.getenv('SNOWFLAKE_PASSWORD')}@"
    f"{os.getenv('SNOWFLAKE_ACCOUNT')}/"
    f"{os.getenv('SNOWFLAKE_DATABASE')}/"
    f"{os.getenv('SNOWFLAKE_SCHEMA')}"
)


engine = create_engine(
    DATABASE_URL,
    connect_args={"session_parameters": {"QUERY_TAG": "AI_OPERATIONS_DIRECTOR"}},
)
