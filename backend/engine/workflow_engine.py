import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
)

from backend.engine.document_parser_python import (
    parse_python_document,
)

from backend.engine.document_parser_cortex import (
    parse_cortex_document,
)

from backend.departments.production.controller import (
    save_production_result,
)

router = APIRouter()

TEMP_FOLDER = "backend/temp"

os.makedirs(
    TEMP_FOLDER,
    exist_ok=True,
)


# =====================================================
# UPLOAD DOCUMENT
# =====================================================


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    department: str = Form(...),
):

    filename = file.filename

    file_path = os.path.join(
        TEMP_FOLDER,
        filename,
    )

    # =================================================
    # SAVE TEMPORARY FILE
    # =================================================

    with open(
        file_path,
        "wb",
    ) as buffer:

        buffer.write(await file.read())

    # =================================================
    # DETECT FILE EXTENSION
    # =================================================

    ext = filename.lower().split(".")[-1]

    # =================================================
    # ROUTE TO PARSER
    #
    # Python parser:
    # XLSX / CSV / PPTX
    #
    # Cortex parser:
    # PDF / PNG / JPG / JPEG
    # =================================================

    if ext in [
        "xlsx",
        "csv",
        "pptx",
    ]:

        result = parse_python_document(
            file_path,
            filename,
        )

    elif ext in [
        "pdf",
        "png",
        "jpg",
        "jpeg",
    ]:

        result = parse_cortex_document(
            file_path,
            filename,
        )

    else:

        return {
            "status": "error",
            "error_type": "UNSUPPORTED_FILE",
            "message": (f"File type '.{ext}' " "is not supported."),
            "expected": [
                "xlsx",
                "csv",
                "pptx",
                "pdf",
                "png",
                "jpg",
                "jpeg",
            ],
        }

    # =================================================
    # DEPARTMENT ROUTING
    # =================================================

    if department.lower() == "production":

        database_result = save_production_result(result)

    else:

        database_result = {
            "status": "not_connected",
            "message": (f"Database saving for {department} " "is not implemented yet."),
        }

    # =================================================
    # HANDLE PRODUCTION VALIDATION ERROR
    # =================================================

    if isinstance(database_result, dict) and database_result.get("valid") is False:

        return {
            "status": "error",
            "department": department,
            "filename": filename,
            "error_type": database_result.get("error_type"),
            "message": database_result.get("message"),
            "expected": database_result.get("expected"),
            "details": database_result.get(
                "details",
                [],
            ),
            "ai_summary": database_result.get("ai_summary"),
            "cortex_content": database_result.get("cortex_content"),
        }

    # =================================================
    # SUCCESS RESPONSE
    # =================================================

    return {
        "status": "success",
        "department": department,
        "filename": filename,
        "database_result": database_result,
        "parser_result": result,
    }
