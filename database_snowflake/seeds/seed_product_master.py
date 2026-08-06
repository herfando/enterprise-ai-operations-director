from database_snowflake.connection import get_snowflake_connection

products = [
    {
        "name": "AquaFresh PET Bottle 330ml",
        "material": "PET Resin",
        "cycle_time": 0.034,
        "capacity": 1765,
        "unit": "pcs",
    },
    {
        "name": "AquaFresh PET Bottle 600ml",
        "material": "PET Resin",
        "cycle_time": 0.045,
        "capacity": 1333,
        "unit": "pcs",
    },
    {
        "name": "CrystalPlast PP Cup 220ml",
        "material": "PP Resin",
        "cycle_time": 0.021,
        "capacity": 2857,
        "unit": "pcs",
    },
    {
        "name": "CrystalPlast PP Cup 240ml",
        "material": "PP Resin",
        "cycle_time": 0.024,
        "capacity": 2500,
        "unit": "pcs",
    },
    {
        "name": "ClearLine PET Bottle 1500ml",
        "material": "PET Resin",
        "cycle_time": 0.075,
        "capacity": 800,
        "unit": "pcs",
    },
    {
        "name": "ProCup PP Cup 180ml",
        "material": "PP Resin",
        "cycle_time": 0.015,
        "capacity": 4000,
        "unit": "pcs",
    },
    {
        "name": "ProCup PP Cup 250ml",
        "material": "PP Resin",
        "cycle_time": 0.030,
        "capacity": 2000,
        "unit": "pcs",
    },
    {
        "name": "NewLine PP Cup 200ml Sealed",
        "material": "PP Resin",
        "cycle_time": 0.021,
        "capacity": 2857,
        "unit": "pcs",
    },
    {
        "name": "ClearLine PET Bottle 330ml",
        "material": "PET Resin",
        "cycle_time": 0.034,
        "capacity": 1765,
        "unit": "pcs",
    },
    {
        "name": "AquaFresh PET Bottle 1500ml",
        "material": "PET Resin",
        "cycle_time": 0.075,
        "capacity": 800,
        "unit": "pcs",
    },
    {
        "name": "PolyPack PP Cup 200ml",
        "material": "PP Resin",
        "cycle_time": 0.020,
        "capacity": 3000,
        "unit": "pcs",
    },
    {
        "name": "PolyPack PP Cup 300ml",
        "material": "PP Resin",
        "cycle_time": 0.040,
        "capacity": 1500,
        "unit": "pcs",
    },
    {
        "name": "EcoCup PP Cup 220ml Biodegradable",
        "material": "PP Resin",
        "cycle_time": 0.021,
        "capacity": 2857,
        "unit": "pcs",
    },
    {
        "name": "TransParent PET Bottle 500ml",
        "material": "PET Resin",
        "cycle_time": 0.028,
        "capacity": 2142,
        "unit": "pcs",
    },
    {
        "name": "TransParent PET Bottle 750ml",
        "material": "PET Resin",
        "cycle_time": 0.055,
        "capacity": 1090,
        "unit": "pcs",
    },
    {
        "name": "FreshSeal PP Cup 250ml Sealed",
        "material": "PP Resin",
        "cycle_time": 0.030,
        "capacity": 2000,
        "unit": "pcs",
    },
    {
        "name": "PureBottle PET Bottle 330ml",
        "material": "PET Resin",
        "cycle_time": 0.034,
        "capacity": 1765,
        "unit": "pcs",
    },
    {
        "name": "PureBottle PET Bottle 600ml",
        "material": "PET Resin",
        "cycle_time": 0.045,
        "capacity": 1333,
        "unit": "pcs",
    },
    {
        "name": "AquaFresh PET Bottle 220ml",
        "material": "PET Resin",
        "cycle_time": 0.025,
        "capacity": 2400,
        "unit": "pcs",
    },
    {
        "name": "CrystalPlast PP Cup 350ml",
        "material": "PP Resin",
        "cycle_time": 0.050,
        "capacity": 1200,
        "unit": "pcs",
    },
]


def seed_product():

    conn = get_snowflake_connection()

    cursor = conn.cursor()

    for product in products:

        cursor.execute(f"""
            INSERT INTO MASTER_DATA.PRODUCT_MASTER
            (
                PRODUCT_NAME,
                MATERIAL_NAME,
                CYCLE_TIME_MINUTES,
                CAPACITY_PER_HOUR,
                UNIT
            )
            VALUES
            (
                '{product["name"]}',
                '{product["material"]}',
                {product["cycle_time"]},
                {product["capacity"]},
                '{product["unit"]}'
            )
            """)

    conn.commit()

    cursor.close()
    conn.close()


if __name__ == "__main__":

    seed_product()

    print("Product master seeded")
