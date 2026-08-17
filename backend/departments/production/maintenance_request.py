from datetime import date, datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from database_snowflake.connection import get_snowflake_connection

router = APIRouter(
    prefix="/production",
    tags=["Production Maintenance"],
)
# =====================================================
# MAINTENANCE REQUEST CONFIGURATION
# =====================================================

MAINTENANCE_REQUEST_PREFIX = "MR-PROD"


# =====================================================
# GENERATE REQUEST ID
# =====================================================


def generate_request_id():
    """
    Generate unique Maintenance Request ID.

    Example:
        MR-PROD-20260809-143025
    """

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

    return f"{MAINTENANCE_REQUEST_PREFIX}-{timestamp}"


# =====================================================
# GET PRODUCTION DATA
# =====================================================


def get_production_rows(
    start_date: date,
    end_date: date,
):
    """
    Get ALL production records inside selected period.

    The frontend period filter is passed directly to this function.
    """

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        query = """
            SELECT
                ID,
                START_PRODUCTION,
                FINISH_PRODUCTION,
                MACHINE_NAME,
                PRODUCT_NAME,
                TOTAL_PLANNING,
                TOTAL_PRODUCTION,
                GOOD_PRODUCT,
                REJECT_PRODUCT,
                DOWNTIME_MINUTES,
                MATERIAL_NAME,
                MATERIAL_USAGE_KG,
                MATERIAL_REMAINING_KG,
                OPERATOR_NAME,
                SHIFT_OPERATOR,
                OPERATOR_GROUP,
                TARGET_STATUS

            FROM DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT

            WHERE START_PRODUCTION::DATE
            BETWEEN %s AND %s

            ORDER BY START_PRODUCTION ASC
        """

        cursor.execute(
            query,
            (
                start_date,
                end_date,
            ),
        )

        rows = cursor.fetchall()

        return rows

    finally:

        cursor.close()
        conn.close()


# =====================================================
# GROUP DOWNTIME BY MACHINE
# =====================================================


def calculate_machine_downtime(rows):
    """
    Calculate total downtime for every machine.

    ALL machines are included.
    """

    machines = {}

    for row in rows:

        machine_name = row[3]

        downtime = row[9] or 0

        if machine_name not in machines:

            machines[machine_name] = {
                "machine_name": machine_name,
                "total_downtime_minutes": 0,
                "record_count": 0,
            }

        machines[machine_name]["total_downtime_minutes"] += downtime

        machines[machine_name]["record_count"] += 1

    return machines


# =====================================================
# RANK MACHINES
# =====================================================


def rank_machines_by_downtime(rows):
    """
    Rank every production machine by total downtime.

    Highest downtime = highest maintenance priority.
    """

    machines = calculate_machine_downtime(rows)

    ranked = list(machines.values())

    ranked.sort(
        key=lambda item: item["total_downtime_minutes"],
        reverse=True,
    )

    for index, machine in enumerate(
        ranked,
        start=1,
    ):

        machine["rank"] = index

    return ranked


# =====================================================
# DETERMINE PRIORITY
# =====================================================


def determine_priority(
    downtime_minutes: float,
):
    """
    Determine maintenance priority based on
    accumulated downtime.
    """

    if downtime_minutes >= 600:

        return {
            "severity": "Critical",
            "priority": "P1",
        }

    if downtime_minutes >= 400:

        return {
            "severity": "High",
            "priority": "P2",
        }

    if downtime_minutes >= 200:

        return {
            "severity": "Medium",
            "priority": "P3",
        }

    return {
        "severity": "Low",
        "priority": "P4",
    }


# =====================================================
# GET MACHINE PRODUCTION DETAILS
# =====================================================


def get_machine_details(
    rows,
    machine_name: str,
):
    """
    Collect production records belonging to
    one selected machine.
    """

    machine_rows = [row for row in rows if row[3] == machine_name]

    if not machine_rows:

        return None

    total_downtime = sum(row[9] or 0 for row in machine_rows)

    total_planning = sum(row[5] or 0 for row in machine_rows)

    total_production = sum(row[6] or 0 for row in machine_rows)

    total_good = sum(row[7] or 0 for row in machine_rows)

    total_reject = sum(row[8] or 0 for row in machine_rows)

    products = sorted({row[4] for row in machine_rows if row[4]})

    materials = sorted({row[10] for row in machine_rows if row[10]})

    operators = sorted({row[13] for row in machine_rows if row[13]})

    shifts = sorted({row[14] for row in machine_rows if row[14]})

    return {
        "machine_name": machine_name,
        "total_downtime_minutes": total_downtime,
        "total_planning": total_planning,
        "total_production": total_production,
        "good_product": total_good,
        "reject_product": total_reject,
        "products": products,
        "materials": materials,
        "operators": operators,
        "shifts": shifts,
        "record_count": len(machine_rows),
    }


# =====================================================
# SAVE MAINTENANCE REQUEST
# =====================================================


def save_maintenance_request(
    request,
):
    """
    Save one Maintenance Request generated by Production
    into Snowflake.

    Table:
        DATABASE_SNOWFLAKE.MASTER_DATA.MAINTENANCE_REQUEST
    """

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:

        insert_sql = """
            INSERT INTO DATABASE_SNOWFLAKE.MASTER_DATA.MAINTENANCE_REQUEST
            (
                REQUEST_ID,
                REQUEST_DATE,
                REQUESTER_DEPARTMENT,
                MAINTENANCE_DEPARTMENT,
                PRODUCTION_START_DATE,
                PRODUCTION_END_DATE,
                MACHINE_NAME,
                PRODUCT_NAME,
                MAINTENANCE_TYPE,
                SEVERITY,
                PRIORITY,
                TOTAL_DOWNTIME_MINUTES,
                TOTAL_PLANNING,
                TOTAL_PRODUCTION,
                GOOD_PRODUCT,
                REJECT_PRODUCT,
                RECORD_COUNT,
                PROBLEM_DESCRIPTION,
                STATUS,
                CREATED_AT
            )
            VALUES
            (
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s
            )
        """

        values = (
            request["request_id"],
            datetime.strptime(
                request["request_date"],
                "%Y-%m-%d",
            ),
            request["requester_department"],
            request["maintenance_department"],
            datetime.strptime(
                request["production_period"]["start_date"],
                "%Y-%m-%d",
            ),
            datetime.strptime(
                request["production_period"]["end_date"],
                "%Y-%m-%d",
            ),
            request["machine_name"],
            request["product_name"],
            request["maintenance_type"],
            request["severity"],
            request["priority"],
            request["total_downtime_minutes"],
            request["production_evidence"]["total_planning"],
            request["production_evidence"]["total_production"],
            request["production_evidence"]["good_product"],
            request["production_evidence"]["reject_product"],
            request["production_evidence"]["record_count"],
            request["problem_description"],
            "Open",
            datetime.now(),
        )

        cursor.execute(
            insert_sql,
            values,
        )

        conn.commit()

        return {
            "status": "success",
            "request_id": request["request_id"],
        }

    except Exception as e:

        conn.rollback()

        return {
            "status": "failed",
            "request_id": request.get("request_id"),
            "error": str(e),
        }

    finally:

        cursor.close()
        conn.close()


# =====================================================
# CREATE MAINTENANCE REQUEST
# =====================================================


def create_maintenance_request(
    start_date: date,
    end_date: date,
    machine_name: str,
):
    """
    Create a Maintenance Request initiated by Production.

    Production identifies the problematic machine.
    Maintenance later fills the execution/result section.
    """

    rows = get_production_rows(
        start_date=start_date,
        end_date=end_date,
    )

    if not rows:

        raise HTTPException(
            status_code=404,
            detail=("No production data found " "for the selected period."),
        )

    machine_details = get_machine_details(
        rows,
        machine_name,
    )

    if not machine_details:

        raise HTTPException(
            status_code=404,
            detail=(f"No production data found " f"for machine '{machine_name}'."),
        )

    priority = determine_priority(machine_details["total_downtime_minutes"])

    request_id = generate_request_id()

    # -------------------------------------------------
    # PRODUCTION REQUEST SECTION
    # -------------------------------------------------

    production_request = {
        "request_id": request_id,
        "request_date": datetime.now().strftime("%Y-%m-%d"),
        "requester_department": "Production",
        "maintenance_department": "Maintenance",
        "production_period": {
            "start_date": str(start_date),
            "end_date": str(end_date),
        },
        "machine_name": machine_name,
        "product_name": ", ".join(machine_details["products"]),
        "total_downtime_minutes": (machine_details["total_downtime_minutes"]),
        "severity": priority["severity"],
        "priority": priority["priority"],
        "maintenance_type": "Corrective",
        "problem_description": (
            "High production downtime detected "
            "on the selected machine during "
            "the production period."
        ),
        "production_evidence": {
            "total_planning": (machine_details["total_planning"]),
            "total_production": (machine_details["total_production"]),
            "good_product": (machine_details["good_product"]),
            "reject_product": (machine_details["reject_product"]),
            "record_count": (machine_details["record_count"]),
        },
    }

    # -------------------------------------------------
    # MAINTENANCE EXECUTION SECTION
    #
    # These fields are intentionally EMPTY.
    # Maintenance department fills them later.
    # -------------------------------------------------

    maintenance_execution = {
        "failure_description": "",
        "root_cause": "",
        "action_taken": "",
        "maintenance_pic": "",
        "maintenance_start": "",
        "maintenance_finish": "",
        "maintenance_duration_hours": "",
        "spare_part_used": "",
        "spare_part_quantity": "",
        "machine_status_after_maintenance": "",
        "verification_by_production": "",
        "verification_date": "",
        "remarks": "",
    }

    # -------------------------------------------------
    # FINAL REQUEST
    # -------------------------------------------------

    request = {
        **production_request,
        "maintenance_execution": maintenance_execution,
    }

    # -------------------------------------------------
    # SAVE REQUEST TO SNOWFLAKE
    # -------------------------------------------------

    database_result = save_maintenance_request(request)

    if database_result["status"] != "success":

        raise HTTPException(
            status_code=500,
            detail=(
                "Maintenance Request was generated " "but failed to save to Snowflake."
            ),
        )

    return {
        "status": "success",
        "request": request,
        "database_result": database_result,
    }


# =====================================================
# RANKING ENDPOINT DATA
# =====================================================


def get_maintenance_candidates(
    start_date: date,
    end_date: date,
):
    """
    Return ALL machines ranked by downtime.

    Frontend can use this result to display
    maintenance candidates.
    """

    rows = get_production_rows(
        start_date=start_date,
        end_date=end_date,
    )

    if not rows:

        return {
            "status": "empty",
            "message": ("No production data found " "for the selected period."),
            "machines": [],
        }

    ranked_machines = rank_machines_by_downtime(rows)

    for machine in ranked_machines:

        priority = determine_priority(machine["total_downtime_minutes"])

        machine["severity"] = priority["severity"]

        machine["priority"] = priority["priority"]

    return {
        "status": "success",
        "start_date": str(start_date),
        "end_date": str(end_date),
        "total_machines": len(ranked_machines),
        "machines": ranked_machines,
    }


# =====================================================
# CREATE REQUEST TEMPLATE
# =====================================================


def create_maintenance_request_template(
    start_date: date,
    end_date: date,
    machine_name: str,
):
    """
    Create a flat structure suitable for
    Excel / PDF / PPT generation.

    The generated file is intended to be filled
    by the Maintenance department.
    """

    result = create_maintenance_request(
        start_date=start_date,
        end_date=end_date,
        machine_name=machine_name,
    )

    request = result["request"]

    execution = request["maintenance_execution"]

    template = {
        # ---------------------------------------------
        # REQUEST INFORMATION
        # ---------------------------------------------
        "Request ID": request["request_id"],
        "Request Date": request["request_date"],
        "Requester Department": (request["requester_department"]),
        "Maintenance Department": (request["maintenance_department"]),
        "Production Start Date": (request["production_period"]["start_date"]),
        "Production End Date": (request["production_period"]["end_date"]),
        # ---------------------------------------------
        # MACHINE INFORMATION
        # ---------------------------------------------
        "Machine Name": request["machine_name"],
        "Product Name": request["product_name"],
        "Maintenance Type": (request["maintenance_type"]),
        "Severity": request["severity"],
        "Priority": request["priority"],
        "Total Downtime (minutes)": (request["total_downtime_minutes"]),
        "Problem Description": (request["problem_description"]),
        # ---------------------------------------------
        # PRODUCTION EVIDENCE
        # ---------------------------------------------
        "Total Planning (pcs)": (request["production_evidence"]["total_planning"]),
        "Total Production (pcs)": (request["production_evidence"]["total_production"]),
        "Good Product (pcs)": (request["production_evidence"]["good_product"]),
        "Reject Product (pcs)": (request["production_evidence"]["reject_product"]),
        # ---------------------------------------------
        # MAINTENANCE EXECUTION
        # ---------------------------------------------
        "Failure / Damage Description": (execution["failure_description"]),
        "Root Cause": execution["root_cause"],
        "Action Taken": execution["action_taken"],
        "Maintenance PIC": (execution["maintenance_pic"]),
        "Maintenance Start": (execution["maintenance_start"]),
        "Maintenance Finish": (execution["maintenance_finish"]),
        "Maintenance Duration (hours)": (execution["maintenance_duration_hours"]),
        "Spare Part Used": (execution["spare_part_used"]),
        "Spare Part Quantity": (execution["spare_part_quantity"]),
        "Machine Status After Maintenance": (
            execution["machine_status_after_maintenance"]
        ),
        "Verification By Production": (execution["verification_by_production"]),
        "Verification Date": (execution["verification_date"]),
        "Remarks": execution["remarks"],
    }

    return {
        "status": "success",
        "request_id": request["request_id"],
        "filename": (f"{request['request_id']}" "_Maintenance_Request.xlsx"),
        "template": template,
    }


# =====================================================
# MAINTENANCE REQUEST ENDPOINTS
# =====================================================


@router.get("/maintenance-request")
def maintenance_request_candidates_endpoint(
    start_date: date = Query(...),
    end_date: date = Query(...),
):
    """
    Get all machines ranked for maintenance.
    """

    return get_maintenance_candidates(
        start_date=start_date,
        end_date=end_date,
    )


@router.post("/maintenance-request")
def create_maintenance_request_endpoint(
    start_date: date = Query(...),
    end_date: date = Query(...),
    machine_name: str = Query(...),
):
    """
    Production creates a Maintenance Request
    for the selected machine.
    """

    return create_maintenance_request(
        start_date=start_date,
        end_date=end_date,
        machine_name=machine_name,
    )


@router.get("/maintenance-request/template")
def maintenance_request_template_endpoint(
    start_date: date = Query(...),
    end_date: date = Query(...),
    machine_name: str = Query(...),
):
    """
    Get Maintenance Request template data.
    """

    return create_maintenance_request_template(
        start_date=start_date,
        end_date=end_date,
        machine_name=machine_name,
    )
