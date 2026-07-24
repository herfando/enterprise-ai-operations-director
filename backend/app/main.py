from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.parsers.excel_parser import extract_excel_text
from app.parsers.csv_parser import extract_csv_text
from app.parsers.image_parser import extract_image_text
from app.parsers.ppt_parser import extract_ppt_text
from app.parsers.pdf_parser import extract_pdf_text
from validators.validator import validate_department_data

import shutil
import os



app = FastAPI(title="Enterprise AI Operations Director API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"status": "AI Operations Backend Running"}


@app.post("/upload")
async def upload(
    department: str = Form(...),
    file: UploadFile = File(...)
):
    filename = file.filename.lower()

    # STEP 1: Check file type
    supported_files = (
        ".pdf", ".pptx",
        ".xlsx", ".xls",
        ".csv",
        ".png", ".jpg", ".jpeg"
    )

    if not filename.endswith(supported_files):
        return {
            "status": "unsupported",
            "message": "File format not supported yet",
            "filename": file.filename
        }

    # STEP 2: Save uploaded file
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # STEP 3: Extract text depending on file type
    try:
        if filename.endswith(".pdf"):
            text = extract_pdf_text(file_location)

        elif filename.endswith(".pptx"):
            text = extract_ppt_text(file_location)

        elif filename.endswith((".xlsx", ".xls")):
            text = extract_excel_text(file_location)

        elif filename.endswith(".csv"):
            text = extract_csv_text(file_location)

        elif filename.endswith((".png", ".jpg", ".jpeg")):
            text = extract_image_text(file_location)

        # STEP 3.1: Extract simple keyword-based data
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

        # STEP 3.2: Validate extracted data
        validation = validate_department_data(department, extracted_data)

    except Exception as e:
        return {
            "status": "failed",
            "message": "File cannot be processed",
            "error": str(e)
        }

    # STEP 4: Response
    return {
        "status": validation["status"],
        "department": department,
        "filename": file.filename,
        "validation": validation,
        "content_preview": text[:500]
    }