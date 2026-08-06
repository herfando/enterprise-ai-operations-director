from sqlalchemy import Column, Integer, String, Float, DateTime

from database_snowflake.base import Base


class ProductionResult(Base):

    __tablename__ = "PRODUCTION_RESULT"

    id = Column(Integer, primary_key=True, autoincrement=True)

    start_production = Column(DateTime)
    finish_production = Column(DateTime)

    machine_name = Column(String)
    product_name = Column(String)

    total_planning = Column(Integer)
    total_production = Column(Integer)
    good_product = Column(Integer)
    reject_product = Column(Integer)

    downtime_minutes = Column(Integer)

    material_name = Column(String)
    material_usage_kg = Column(Float)
    material_remaining_kg = Column(Float)

    operator_name = Column(String)
    shift_operator = Column(String)
    operator_group = Column(String)

    target_status = Column(String)
