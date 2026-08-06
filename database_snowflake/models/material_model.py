from sqlalchemy import Column, Integer, String, Float

from database_snowflake.base import Base


class MaterialMaster(Base):

    __tablename__ = "MATERIAL_MASTER"

    id = Column(Integer, primary_key=True, autoincrement=True)

    material_name = Column(String, unique=True, nullable=False)

    unit = Column(String, default="kg")

    minimum_stock = Column(Float, nullable=False)

    rop_level = Column(Float, nullable=False)

    status = Column(String, default="ACTIVE")
