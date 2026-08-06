import os

from fastapi import APIRouter, UploadFile, File, Form


from backend.engine.document_parser_python import parse_python_document
from backend.engine.document_parser_cortex import parse_cortex_document

router = APIRouter()


TEMP_FOLDER = "backend/temp"


os.makedirs(TEMP_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...), department: str = Form(...)):

    filename = file.filename

    file_path = os.path.join(TEMP_FOLDER, filename)

    # simpan file sementara
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    ext = filename.lower().split(".")[-1]

    # ==========================
    # ROUTE PARSER
    # ==========================

    if ext in ["xlsx", "csv"]:

        result = parse_python_document(file_path, filename)

    elif ext in ["pdf", "png", "jpg", "jpeg"]:

        result = parse_cortex_document(file_path, filename)

    else:

        return {"status": "error", "message": f"Extension {ext} belum support"}

    return {
        "status": "success",
        "department": department,
        "filename": filename,
        "parser_result": result,
    }
