from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ProductionResult(Base):

    __tablename__ = "PRODUCTION_RESULT"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # waktu produksi
    start_production = Column(DateTime)
    finish_production = Column(DateTime)

    # mesin & produk
    machine_name = Column(String)
    product_name = Column(String)

    # planning dan hasil
    total_planning = Column(Integer)
    total_production = Column(Integer)
    good_product = Column(Integer)
    reject_product = Column(Integer)

    # OEE
    downtime_minutes = Column(Integer)

    # material
    material_name = Column(String)
    material_usage_kg = Column(Float)
    material_remaining_kg = Column(Float)

    # manpower
    operator_name = Column(String)
    shift_operator = Column(String)
    operator_group = Column(String)

    # status
    target_status = Column(String)
