from database_snowflake.connection import get_snowflake_connection

employees = [
    {"name": "Ahmad Fauzi", "shift": "Shift 1", "group": "Group A"},
    {"name": "Dedi Kurniawan", "shift": "Shift 2", "group": "Group B"},
    {"name": "Siti Aminah", "shift": "Shift 1", "group": "Group A"},
    {"name": "Yuni Lestari", "shift": "Shift 2", "group": "Group B"},
    {"name": "Bambang Santoso", "shift": "Shift 3", "group": "Group C"},
    {"name": "Rudi Hartono", "shift": "Shift 3", "group": "Group C"},
    {"name": "Dewi Puspita", "shift": "Shift 1", "group": "Group A"},
]


def seed_employee():

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    for emp in employees:

        cursor.execute(f"""
            INSERT INTO MASTER_DATA.EMPLOYEE_MASTER
            (
                EMPLOYEE_NAME,
                DEPARTMENT,
                SHIFT,
                GROUP_OPERATOR,
                STATUS
            )
            VALUES
            (
                '{emp["name"]}',
                'PRODUCTION',
                '{emp["shift"]}',
                '{emp["group"]}',
                'ACTIVE'
            )
            """)

    conn.commit()

    cursor.close()
    conn.close()


if __name__ == "__main__":

    seed_employee()

    print("Employee master seeded")
