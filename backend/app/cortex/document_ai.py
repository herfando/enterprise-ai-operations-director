import os
import json

from app.database.snowflake import get_snowflake_connection


STAGE_NAME = "@AI_OPERATIONS.AI_CONFIG.DOCUMENT_STAGE"


# =====================================================
# UPLOAD FILE KE SNOWFLAKE STAGE
# =====================================================

def upload_to_stage(file_path):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        absolute_path = os.path.abspath(file_path)

        print("UPLOAD FILE:", absolute_path)

        sql = """
        PUT %s
        @AI_OPERATIONS.AI_CONFIG.DOCUMENT_STAGE
        AUTO_COMPRESS=FALSE
        OVERWRITE=TRUE
        """

        cursor.execute(
            sql,
            (
                "file://" + absolute_path,
            )
        )

        result = cursor.fetchall()

        print("PUT RESULT:", result)

        return result

    finally:
        cursor.close()
        conn.close()


# =====================================================
# CORTEX DOCUMENT AI
# PDF / IMAGE / SCAN TULISAN TANGAN
# =====================================================

def parse_document_with_cortex(filename):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        safe_filename = filename.replace(
            "'",
            "''"
        )

        sql = f"""
        SELECT AI_PARSE_DOCUMENT(
            TO_FILE(
                '{STAGE_NAME}',
                '{safe_filename}'
            )
        )
        """

        cursor.execute(sql)

        result = cursor.fetchone()

        if result is None:
            return None

        parsed = result[0]

        print("PARSED TYPE :", type(parsed))
        print("PARSED VALUE :", parsed)

        return parsed

    finally:
        cursor.close()
        conn.close()


# =====================================================
# EXCEL XLSX PARSER
# =====================================================

def extract_excel_file(file_path):

    import pandas as pd

    try:
        df = pd.read_excel(
            file_path,
            engine="openpyxl"
        )

        content = df.to_string(
            index=False
        )

        print("EXCEL CONTENT:")
        print(content)

        return content

    except ImportError as e:
        raise Exception(
            "Excel parsing failed: library 'openpyxl' belum "
            f"ter-install. Jalankan: pip install openpyxl. Detail: {e}"
        )

    except Exception as e:
        raise Exception(
            f"Excel parsing failed: {e}"
        )


# =====================================================
# POWERPOINT PPTX PARSER
# =====================================================

def extract_pptx_file(file_path):

    try:
        from pptx import Presentation
    except ImportError as e:
        raise Exception(
            "PowerPoint parsing failed: library 'python-pptx' belum "
            f"ter-install. Jalankan: pip install python-pptx. Detail: {e}"
        )

    try:
        prs = Presentation(file_path)

        lines = []

        for slide_number, slide in enumerate(prs.slides, start=1):

            lines.append(f"--- SLIDE {slide_number} ---")

            for shape in slide.shapes:

                # teks biasa (title, body, text box, dll)
                if shape.has_text_frame:
                    for paragraph in shape.text_frame.paragraphs:
                        text = "".join(
                            run.text for run in paragraph.runs
                        ).strip()

                        if text:
                            lines.append(text)

                # teks di dalam tabel
                if shape.has_table:
                    for row in shape.table.rows:
                        row_text = " | ".join(
                            cell.text.strip() for cell in row.cells
                        )
                        if row_text.strip(" |"):
                            lines.append(row_text)

            # speaker notes
            if slide.has_notes_slide:
                notes_text = slide.notes_slide.notes_text_frame.text.strip()
                if notes_text:
                    lines.append(f"[NOTES] {notes_text}")

        content = "\n".join(lines)

        print("PPTX CONTENT:")
        print(content)

        return content

    except Exception as e:
        raise Exception(
            f"PowerPoint parsing failed: {e}"
        )


# =====================================================
# FILE ROUTER
# =====================================================

def extract_document_content(
        file_path,
        filename
):

    ext = os.path.splitext(filename)[1].lower().lstrip(".")

    print("FILE NAME:", filename)
    print("EXTENSION:", ext)

    if ext in [
        "pdf",
        "png",
        "jpg",
        "jpeg"
    ]:

        parsed = parse_document_with_cortex(
            filename
        )

        if parsed is None:
            raise Exception(
                "AI_PARSE_DOCUMENT returned NULL"
            )

        if isinstance(parsed, str):
            try:
                parsed = json.loads(parsed)
            except json.JSONDecodeError:
                parsed = {
                    "content": parsed
                }

        return parsed.get(
            "content",
            ""
        )

    elif ext in [
        "xlsx"
    ]:

        return extract_excel_file(
            file_path
        )

    elif ext in [
        "csv"
    ]:

        import pandas as pd

        df = pd.read_csv(
            file_path
        )

        return df.to_string(
            index=False
        )

    elif ext in [
        "pptx"
    ]:

        return extract_pptx_file(
            file_path
        )

    else:

        raise Exception(
            f"Unsupported file {ext}"
        )


# =====================================================
# FILE EXCEL / CSV / PPT
# DIBACA DENGAN CORTEX
# =====================================================

def extract_structured_file_with_cortex(filename):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        prompt = f"""
YOU ARE AN AI DOCUMENT ANALYZER.

A manufacturing company uploaded this file:

{filename}

READ THIS DOCUMENT CONTENT.

EXTRACT ALL IMPORTANT DATA.

RETURN RAW TEXT JSON:

{{
"document_type":"",
"content":""
}}
"""

        sql = """
        SELECT AI_COMPLETE(
            'MISTRAL-LARGE2',
            %s
        )
        """

        cursor.execute(
            sql,
            (prompt,)
        )

        result = cursor.fetchone()

        return result[0]

    finally:
        cursor.close()
        conn.close()


# =====================================================
# AI OPERATIONS DIRECTOR
# SEMUA FILE MASUK SINI
# =====================================================

def analyze_with_operations_director(document_text, department):

    conn = get_snowflake_connection()
    cursor = conn.cursor()

    try:
        prompt = f"""
YOU ARE AN AI OPERATIONS DIRECTOR
IN A MANUFACTURING COMPANY.

DEPARTMENT:

{department}

ANALYZE THIS DOCUMENT.

RETURN JSON ONLY:

{{
"document_type":"",
"department_detected":"",
"department_match":"",

"missing_data":[],

"risk_level":"",
"problem":"",
"recommended_action":"",

"data":{{}}
}}

DOCUMENT:

{document_text}
"""

        sql = """
        SELECT AI_COMPLETE(
            'MISTRAL-LARGE2',
            %s
        )
        """

        cursor.execute(
            sql,
            (prompt,)
        )

        result = cursor.fetchone()

        return result[0]

    finally:
        cursor.close()
        conn.close()


# =====================================================
# MAIN ORCHESTRATOR
# =====================================================

def analyze_document(file_path, filename, department):

    upload_result = upload_to_stage(file_path)

    print(upload_result)

    content = extract_document_content(
        file_path,
        filename
    )

    print("CONTENT TYPE:", type(content))
    print("CONTENT:", content)

    decision = analyze_with_operations_director(
        content,
        department
    )

    return {
        "department": department,
        "document": content,
        "extracted": decision
    }