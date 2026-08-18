from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import Any

from backend.services.snowflake_service import get_snowflake_connection

router = APIRouter(
    prefix="/database/production",
    tags=["Database - Production"],
)


TABLE_NAME = "DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT"


# =====================================================
# UPDATE MODEL
# =====================================================


class ProductionUpdate(BaseModel):

    model_config = ConfigDict(populate_by_name=True)

    START_PRODUCTION: str | None = None
    FINISH_PRODUCTION: str | None = None
    MACHINE_NAME: str | None = None
    PRODUCT_NAME: str | None = None
    TOTAL_PLANNING: int | None = None
    TOTAL_PRODUCTION: int | None = None
    GOOD_PRODUCT: int | None = None
    REJECT_PRODUCT: int | None = None
    DOWNTIME_MINUTES: int | None = None
    MATERIAL_NAME: str | None = None
    MATERIAL_USAGE_KG: float | None = None
    MATERIAL_REMAINING_KG: float | None = None
    OPERATOR_NAME: str | None = None
    SHIFT_OPERATOR: str | None = None
    OPERATOR_GROUP: str | None = None
    TARGET_STATUS: str | None = None


# =====================================================
# CREATE MODEL
# =====================================================


class ProductionCreate(BaseModel):
    START_PRODUCTION: str
    FINISH_PRODUCTION: str
    MACHINE_NAME: str
    PRODUCT_NAME: str
    TOTAL_PLANNING: int
    TOTAL_PRODUCTION: int
    GOOD_PRODUCT: int
    REJECT_PRODUCT: int
    DOWNTIME_MINUTES: int
    MATERIAL_NAME: str
    MATERIAL_USAGE_KG: float
    MATERIAL_REMAINING_KG: float
    OPERATOR_NAME: str
    SHIFT_OPERATOR: str
    OPERATOR_GROUP: str
    TARGET_STATUS: str


# =====================================================
# GET PRODUCTION DATA
# =====================================================


@router.get("")
def get_production_data() -> dict[str, Any]:

    connection = None
    cursor = None

    try:
        connection = get_snowflake_connection()
        cursor = connection.cursor()

        cursor.execute(f"""
            SELECT *
            FROM {TABLE_NAME}
            ORDER BY ID
            """)

        columns = [column[0] for column in cursor.description]

        rows = cursor.fetchall()

        data = [dict(zip(columns, row)) for row in rows]

        return {
            "status": "success",
            "department": "Production",
            "table": TABLE_NAME,
            "total": len(data),
            "data": data,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch Production data: {error}",
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =====================================================
# UPDATE PRODUCTION DATA
# =====================================================


@router.put("/{production_id}")
def update_production_data(
    production_id: int,
    data: ProductionUpdate,
) -> dict[str, Any]:

    connection = None
    cursor = None

    try:

        update_data = data.model_dump(
            exclude_unset=True,
        )

        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No fields provided for update.",
            )

        connection = get_snowflake_connection()
        cursor = connection.cursor()

        set_clauses = []
        values = []

        for field, value in update_data.items():

            column_name = field.upper()

            set_clauses.append(f"{column_name} = %s")

            values.append(value)

        values.append(production_id)

        sql = f"""
            UPDATE {TABLE_NAME}
            SET {", ".join(set_clauses)}
            WHERE ID = %s
        """

        cursor.execute(
            sql,
            tuple(values),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Production data updated successfully.",
            "production_id": production_id,
        }

    except HTTPException:
        raise

    except Exception as error:

        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update Production data: {error}",
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =====================================================
# DELETE PRODUCTION DATA
# =====================================================


@router.delete("/{production_id}")
def delete_production_data(
    production_id: int,
) -> dict[str, Any]:

    connection = None
    cursor = None

    try:

        connection = get_snowflake_connection()
        cursor = connection.cursor()

        cursor.execute(
            f"""
            DELETE FROM {TABLE_NAME}
            WHERE ID = %s
            """,
            (production_id,),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Production data deleted successfully.",
            "production_id": production_id,
        }

    except Exception as error:

        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete Production data: {error}",
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =====================================================
# CREATE PRODUCTION DATA
# =====================================================


@router.post("")
def create_production_data(
    data: ProductionCreate,
) -> dict[str, Any]:

    connection = None
    cursor = None

    try:

        insert_data = data.model_dump(
            exclude_unset=True,
        )

        if not insert_data:
            raise HTTPException(
                status_code=400,
                detail="No fields provided for create.",
            )

        connection = get_snowflake_connection()
        cursor = connection.cursor()

        columns = []
        placeholders = []
        values = []

        for field, value in insert_data.items():

            columns.append(field.upper())

            placeholders.append("%s")

            values.append(value)

        sql = f"""
            INSERT INTO {TABLE_NAME}
            ({", ".join(columns)})
            VALUES ({", ".join(placeholders)})
        """

        cursor.execute(
            sql,
            tuple(values),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Production data created successfully.",
        }

    except HTTPException:
        raise

    except Exception as error:

        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create Production data: {error}",
        )

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
