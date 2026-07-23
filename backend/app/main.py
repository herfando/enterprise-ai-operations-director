from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.parsers.pdf_parser import extract_pdf_text
from validators.validator import validate_department_data

import shutil
import os


app = FastAPI(
    title="Enterprise AI Operations Director API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@app.get("/")
def home():
    return {
        "status": "AI Operations Backend Running"
    }


@app.post("/upload")
async def upload(
    department: str = Form(...),
    file: UploadFile = File(...)
):

    filename = file.filename.lower()

    # STEP 1
    # Check file type
    if not filename.endswith(".pdf"):
        return {
            "status": "unsupported",
            "message": "Currently only PDF parser is available",
            "filename": file.filename
        }

    # STEP 2
    # Save uploaded file
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # STEP 3
    # Extract PDF text
    try:
        text = extract_pdf_text(file_location)

        extracted_data = {}
        lower_text = text.lower()

        if "oee" in lower_text:
            extracted_data["oee"] = True

        if "performance" in lower_text:
            extracted_data["performance"] = True

        if "quality" in lower_text:
            extracted_data["quality"] = True

        if "downtime" in lower_text:
            extracted_data["downtime"] = True

        validation = validate_department_data(
            department,
            extracted_data
        )

    except Exception as e:
        return {
            "status": "failed",
            "message": "PDF cannot be processed",
            "error": str(e)
        }

    # STEP 4
    # Temporary response
    return {
        "status": validation["status"],
        "department": department,
        "filename": file.filename,
        "validation": validation,
        "content_preview": text[:500]
    }