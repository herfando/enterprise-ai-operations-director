from sqlalchemy import Column, Integer, String, Float
from database_snowflake.base import Base


class ProductMaster(Base):

    __tablename__ = "PRODUCT_MASTER"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # informasi produk
    product_name = Column(String, unique=True, nullable=False)

    # material utama
    material_name = Column(String, nullable=False)

    # standard produksi
    cycle_time_minutes = Column(Float, nullable=False)

    # kapasitas standard mesin
    capacity_per_hour = Column(Integer, nullable=False)

    # optional untuk kebutuhan dashboard
    unit = Column(String, default="pcs")
