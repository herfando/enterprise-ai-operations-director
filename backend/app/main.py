from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.parsers.pdf_parser import extract_pdf_text
from app.parsers.ppt_parser import extract_ppt_text
from app.parsers.excel_parser import extract_excel_text
from app.parsers.csv_parser import extract_csv_text
from app.parsers.image_parser import extract_image_text

from app.extractors.data_extractor import extract_operational_data

from validators.validator import validate_department_data

import shutil
import os


app = FastAPI(
    title="Enterprise AI Operations Director API"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Upload folder
# =========================

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)



# =========================
# Health Check
# =========================

@app.get("/")
def home():

    return {
        "status": "AI Operations Backend Running"
    }



# =========================
# Upload Report
# =========================

@app.post("/upload")
async def upload(

    department: str = Form(...),

    file: UploadFile = File(...)

):

    filename = file.filename.lower()



    # =========================
    # STEP 1
    # Check file type
    # =========================


    supported_extensions = (

        ".pdf",
        ".pptx",

        ".xlsx",
        ".xls",

        ".csv",

        ".png",
        ".jpg",
        ".jpeg"

    )


    if not filename.endswith(supported_extensions):

        return {

            "status":"unsupported",

            "message":
            "File format not supported",

            "filename":
            file.filename

        }



    # =========================
    # STEP 2
    # Save file
    # =========================


    file_location = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )


    with open(
        file_location,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )



    # =========================
    # STEP 3
    # Extract text
    # =========================


    try:


        if filename.endswith(".pdf"):

            text = extract_pdf_text(
                file_location
            )


        elif filename.endswith(".pptx"):

            text = extract_ppt_text(
                file_location
            )


        elif filename.endswith(
            (".xlsx",".xls")
        ):

            text = extract_excel_text(
                file_location
            )


        elif filename.endswith(".csv"):

            text = extract_csv_text(
                file_location
            )


        elif filename.endswith(
            (".png",".jpg",".jpeg")
        ):

            text = extract_image_text(
                file_location
            )


        else:

            text = ""



        # =========================
        # STEP 4
        # AI Data Extraction
        # =========================


        extracted_data = extract_operational_data(
            text
        )



        # =========================
        # STEP 5
        # Department Validation
        # =========================


        validation = validate_department_data(

            department,

            extracted_data

        )



    except Exception as e:


        return {

            "status":"failed",

            "message":
            "File cannot be processed",

            "error":
            str(e)

        }



    # =========================
    # STEP 6
    # Final Response
    # =========================


    return {


        "status":
        validation["status"],


        "department":
        department,


        "filename":
        file.filename,


        "extracted_data":
        extracted_data,


        "validation":
        validation,


        "content_preview":
        text[:500]

    }