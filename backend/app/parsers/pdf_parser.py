from pypdf import PdfReader
from pdf2image import convert_from_path
import pytesseract


pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


POPPLER_PATH = (
    r"C:\poppler-26.02.0\Library\bin"
)


def extract_pdf_text(file_path):

    text = ""


    # 1. Coba baca PDF text biasa
    reader = PdfReader(file_path)


    for page in reader.pages:

        extracted = page.extract_text()

        if extracted:
            text += extracted



    # 2. Kalau kosong berarti PDF scan
    if not text.strip():

        images = convert_from_path(
            file_path,
            dpi=300,
            poppler_path=POPPLER_PATH
        )


        for image in images:

            ocr_text = pytesseract.image_to_string(
                image
            )

            text += ocr_text



    return text