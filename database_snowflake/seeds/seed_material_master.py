from database_snowflake.connection import get_snowflake_connection

materials = [
    {"name": "PET Resin", "minimum_stock": 2000, "rop": 5000},
    {"name": "PP Resin", "minimum_stock": 2000, "rop": 5000},
]


def seed_material():

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    for material in materials:

        cursor.execute(f"""
            INSERT INTO MASTER_DATA.MATERIAL_MASTER
            (
                MATERIAL_NAME,
                UNIT,
                MINIMUM_STOCK,
                ROP_LEVEL,
                STATUS
            )
            VALUES
            (
                '{material["name"]}',
                'kg',
                {material["minimum_stock"]},
                {material["rop"]},
                'ACTIVE'
            )
            """)

    conn.commit()

    cursor.close()
    conn.close()


if __name__ == "__main__":

    seed_material()

    print("Material master seeded")
