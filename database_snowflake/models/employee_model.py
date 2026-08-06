from sqlalchemy import Column, Integer, String

from database_snowflake.base import Base


class EmployeeMaster(Base):

    __tablename__ = "EMPLOYEE_MASTER"

    id = Column(Integer, primary_key=True, autoincrement=True)

    employee_name = Column(String, nullable=False)

    department = Column(String, nullable=False)

    shift = Column(String, nullable=False)

    group_operator = Column(String, nullable=False)

    status = Column(String, default="ACTIVE")
