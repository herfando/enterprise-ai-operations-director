from sqlalchemy import Column, Integer, String, Float, Date, DateTime, JSON
from datetime import datetime

from database_snowflake.base import Base


class AIDecision(Base):

    __tablename__ = "AI_DECISIONS"

    id = Column(Integer, primary_key=True, autoincrement=True)

    department = Column(String)

    start_date = Column(Date)
    end_date = Column(Date)

    title = Column(String)
    severity = Column(String)
    priority = Column(String)

    confidence = Column(Float)

    executive_summary = Column(String)
    primary_problem = Column(String)
    why_first = Column(String)

    evidence = Column(JSON)

    business_impact = Column(String)

    immediate_actions = Column(JSON)
    follow_up_actions = Column(JSON)

    recommendation = Column(String)
    expected_impact = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
