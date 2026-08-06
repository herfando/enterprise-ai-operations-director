import os

from backend.services.cortex_service import parse_document_with_cortex


def parse_cortex_document(file_path, filename):

    ext = os.path.splitext(filename)[1].lower()

    supported = [".pdf", ".png", ".jpg", ".jpeg"]

    if ext not in supported:

        raise Exception(f"Cortex parser tidak support {ext}")

    result = parse_document_with_cortex(file_path, filename)

    return {"type": "cortex", "file": filename, "content": result}
