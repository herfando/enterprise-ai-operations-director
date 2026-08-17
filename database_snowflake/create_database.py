from database_snowflake.connection import get_snowflake_connection
from database_snowflake.schema_config import SCHEMA_MAP

from database_snowflake.base import Base
from database_snowflake.engine import engine

# register ORM models

from database_snowflake.models.product_model import ProductMaster
from database_snowflake.models.machine_model import MachineMaster
from database_snowflake.models.employee_model import EmployeeMaster
from database_snowflake.models.material_model import MaterialMaster
from database_snowflake.models.production_result_model import ProductionResult
from database_snowflake.models.ai_decision_model import AIDecision
from database_snowflake.models.maintenance_request_model import MaintenanceRequest

DATABASE_NAME = "DATABASE_SNOWFLAKE"
MASTER_SCHEMA = "MASTER_DATA"


def create_database():

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        # =========================
        # CREATE DATABASE
        # =========================

        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}")

        print(f"Database {DATABASE_NAME} ready")

        # =========================
        # USE DATABASE
        # =========================

        cursor.execute(f"USE DATABASE {DATABASE_NAME}")

        # =========================
        # CREATE SCHEMA
        # =========================

        for schema_name in SCHEMA_MAP.values():

            cursor.execute(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")

            print(f"Schema {schema_name} ready")

    finally:

        cursor.close()
        conn.close()


def create_tables():

    with engine.connect() as conn:

        conn.exec_driver_sql(f"USE DATABASE {DATABASE_NAME}")

        conn.exec_driver_sql(f"USE SCHEMA {MASTER_SCHEMA}")

    Base.metadata.create_all(engine)

    print("ORM tables created")


if __name__ == "__main__":

    create_database()

    create_tables()

    print("Snowflake database structure created")
