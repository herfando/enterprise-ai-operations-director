from sqlalchemy import Column, Integer, String

from database_snowflake.base import Base


class MachineMaster(Base):

    __tablename__ = "MACHINE_MASTER"

    id = Column(Integer, primary_key=True, autoincrement=True)

    machine_name = Column(String, unique=True, nullable=False)

    machine_type = Column(String, nullable=False)

    department = Column(String, default="PRODUCTION")

    capacity_per_hour = Column(Integer, nullable=False)

    status = Column(String, default="ACTIVE")
