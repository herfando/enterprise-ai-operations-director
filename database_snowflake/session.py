from sqlalchemy.orm import sessionmaker

from database_snowflake.engine import engine

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)
