from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.cortex.document_ai import analyze_document

import os
import shutil


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
# Upload Folder
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
        "status":
        "AI Operations Backend Running"
    }



# =========================
# Cortex Upload
# =========================

@app.post("/upload")
async def upload(

    department: str = Form(...),

    file: UploadFile = File(...)

):


    filename = file.filename



    supported_extensions = (

        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".xlsx",
        ".xls",
        ".csv",
        ".pptx"

    )


    if not filename.lower().endswith(
        supported_extensions
    ):

        return {

            "status":
            "unsupported",

            "message":
            "File format not supported"

        }



    # =========================
    # SAVE TEMP FILE
    # =========================

    file_location = os.path.join(
        UPLOAD_FOLDER,
        filename
    )


    with open(
        file_location,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )



    try:


        # =========================
        # SNOWFLAKE CORTEX
        # =========================

        result = analyze_document(

            file_location,

            filename,

            department

        )


        return {

            "status":
            "success",

            "department":
            department,

            "filename":
            filename,

            "cortex_result":
            result

        }



    except Exception as e:


        return {

            "status":
            "failed",

            "error":
            str(e)

        }