from sqlalchemy import Column, Integer, String, Float, DateTime

from database_snowflake.base import Base


class MaintenanceRequest(Base):

    __tablename__ = "MAINTENANCE_REQUEST"

    # =====================================================
    # REQUEST INFORMATION
    # =====================================================

    request_id = Column(String, primary_key=True)

    request_date = Column(DateTime)

    requester_department = Column(String)

    maintenance_department = Column(String)

    production_start_date = Column(DateTime)

    production_end_date = Column(DateTime)

    # =====================================================
    # MACHINE INFORMATION
    # =====================================================

    machine_name = Column(String)

    product_name = Column(String)

    maintenance_type = Column(String)

    severity = Column(String)

    priority = Column(String)

    # =====================================================
    # PRODUCTION PROBLEM
    # =====================================================

    total_downtime_minutes = Column(Float)

    total_planning = Column(Integer)

    total_production = Column(Integer)

    good_product = Column(Integer)

    reject_product = Column(Integer)

    record_count = Column(Integer)

    problem_description = Column(String)

    # =====================================================
    # REQUEST STATUS
    # =====================================================

    status = Column(String)

    # =====================================================
    # AUDIT
    # =====================================================

    created_at = Column(DateTime)
