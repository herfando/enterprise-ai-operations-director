from database_snowflake.models.machine_model import MachineMaster
from database_snowflake.connection import get_snowflake_connection

machines = [
    {
        "machine_name": "Blow Molding Machine 01",
        "machine_type": "Blow Molding",
        "capacity_per_hour": 5000,
    },
    {
        "machine_name": "Blow Molding Machine 02",
        "machine_type": "Blow Molding",
        "capacity_per_hour": 5000,
    },
    {
        "machine_name": "Blow Molding Machine 03",
        "machine_type": "Blow Molding",
        "capacity_per_hour": 5000,
    },
    {
        "machine_name": "Injection Molding Machine 01",
        "machine_type": "Injection Molding",
        "capacity_per_hour": 6875,
    },
    {
        "machine_name": "Injection Molding Machine 02",
        "machine_type": "Injection Molding",
        "capacity_per_hour": 6875,
    },
    {
        "machine_name": "Injection Molding Machine 03",
        "machine_type": "Injection Molding",
        "capacity_per_hour": 6875,
    },
    {
        "machine_name": "Injection Molding Machine 04",
        "machine_type": "Injection Molding",
        "capacity_per_hour": 6875,
    },
]


def seed_machine():

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    for machine in machines:

        cursor.execute(f"""
            INSERT INTO MASTER_DATA.MACHINE_MASTER
            (
                MACHINE_NAME,
                MACHINE_TYPE,
                DEPARTMENT,
                CAPACITY_PER_HOUR,
                STATUS
            )
            VALUES
            (
                '{machine["machine_name"]}',
                '{machine["machine_type"]}',
                'PRODUCTION',
                {machine["capacity_per_hour"]},
                'ACTIVE'
            )
            """)

    conn.commit()

    cursor.close()
    conn.close()


if __name__ == "__main__":

    seed_machine()

    print("Machine master seeded")
