from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
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
async def upload_report(
    department: str = Form(...),
    file: UploadFile = File(...)
):

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"


    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )


    return {
        "message": "File received",
        "department": department,
        "filename": file.filename
    }