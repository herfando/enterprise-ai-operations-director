# backend/departments/production/rules.py


# =====================================================
# PRODUCTION DOCUMENT VALIDATION
# =====================================================


def validate_production_document(parser_result):

    # -------------------------------------------------
    # 1. CHECK PARSER RESULT
    # -------------------------------------------------

    if not parser_result:

        return {
            "valid": False,
            "error_type": "EMPTY_DOCUMENT",
            "message": ("The uploaded document could not be processed."),
            "expected": ("A readable Production Result document."),
            "details": ["No parser result was returned."],
        }

    # =================================================
    # CORTEX DOCUMENT
    # =================================================

    if parser_result.get("type") == "cortex":

        cortex_content = parser_result.get("content")

        if not cortex_content:

            return {
                "valid": False,
                "error_type": "CORTEX_NO_CONTENT",
                "message": (
                    "The AI document reader could not "
                    "extract readable content from this document."
                ),
                "expected": (
                    "A Production Result containing "
                    "Machine, Product, Planning, Production, "
                    "Good Product, Reject Product, and Downtime."
                ),
                "details": [
                    "Cortex did not return readable document content.",
                    "The document was not inserted into the Production database.",
                ],
            }

        # ---------------------------------------------
        # EXTRACT TEXT FROM CORTEX
        # ---------------------------------------------

        if isinstance(cortex_content, dict):

            extracted_text = cortex_content.get("content", "")

        else:

            extracted_text = str(cortex_content)

        extracted_text = str(extracted_text).strip()

        if not extracted_text:

            return {
                "valid": False,
                "error_type": "CORTEX_NO_CONTENT",
                "message": (
                    "The AI document reader could not "
                    "extract readable content from this document."
                ),
                "expected": (
                    "A Production Result containing "
                    "Machine, Product, Planning, Production, "
                    "Good Product, Reject Product, and Downtime."
                ),
                "details": [
                    "Cortex returned an empty document result.",
                    "The document was not inserted into the Production database.",
                ],
            }

        # ---------------------------------------------
        # CORTEX REVIEW
        #
        # IMPORTANT:
        # We do NOT guess what handwritten text means.
        # We only report what Cortex actually read.
        # ---------------------------------------------

        return {
            "valid": False,
            "error_type": "CORTEX_REVIEW_REQUIRED",
            "message": (
                "The document was successfully analyzed by "
                "AI, but some required Production Result "
                "fields could not be confidently identified."
            ),
            "expected": (
                "A complete Production Result containing "
                "Machine, Product, Planning, Production, "
                "Good Product, Reject Product, and Downtime."
            ),
            "details": [
                "Cortex successfully read the document.",
                "The extracted information requires Production "
                "field validation before database registration.",
                "The document was not inserted into the Production database.",
            ],
            "cortex_content": cortex_content,
            "ai_summary": {
                "title": "AI Analysis Completed",
                "message": (
                    "The document was successfully read by "
                    "Cortex AI, but it requires additional "
                    "validation before it can be registered."
                ),
                "detected_text": extracted_text,
            },
        }

    # =================================================
    # PYTHON / EXCEL / CSV DOCUMENT
    # =================================================

    rows = parser_result.get("data")

    if not rows:

        return {
            "valid": False,
            "error_type": "NO_DATA",
            "message": ("The document does not contain readable data."),
            "expected": (
                "A Production Result / Production Report "
                "containing production performance data."
            ),
            "details": [
                "No data rows were found.",
                "The document was not inserted into the Production database.",
            ],
        }

    # -------------------------------------------------
    # DETECT PRODUCTION ROWS
    # -------------------------------------------------

    production_rows = []

    for row in rows:

        if not isinstance(row, dict):
            continue

        if isinstance(
            row.get("DATA HASIL PRODUKSI"),
            int,
        ):
            production_rows.append(row)

    # -------------------------------------------------
    # NOT A PRODUCTION DOCUMENT
    # -------------------------------------------------

    if not production_rows:

        return {
            "valid": False,
            "error_type": "NOT_PRODUCTION_DOCUMENT",
            "message": (
                "The uploaded document was readable, "
                "but its structure does not match a "
                "Production Result document."
            ),
            "expected": (
                "A Production Result / Production Report "
                "containing production performance data."
            ),
            "details": [
                "No Production Result records were detected.",
                (
                    "Required production information includes "
                    "Machine, Product, Planning, Production, "
                    "Good Product, Reject Product, and Downtime."
                ),
                (
                    "Please upload the correct Production Result "
                    "document for the Production Dashboard."
                ),
                "The document was not inserted into the Production database.",
            ],
        }

    # -------------------------------------------------
    # REQUIRED STRUCTURE
    # -------------------------------------------------

    required_columns = {
        "Unnamed: 1": "Start Production",
        "Unnamed: 2": "Finish Production",
        "Unnamed: 3": "Machine Name",
        "Unnamed: 4": "Product Name",
        "Unnamed: 5": "Total Planning",
        "Unnamed: 6": "Total Production",
        "Unnamed: 7": "Good Product",
        "Unnamed: 8": "Reject Product",
        "Unnamed: 9": "Downtime Minutes",
        "Unnamed: 10": "Material Name",
        "Unnamed: 11": "Material Usage",
        "Unnamed: 12": "Material Remaining",
        "Unnamed: 13": "Operator Name",
        "Unnamed: 14": "Shift",
        "Unnamed: 15": "Operator Group",
        "Unnamed: 16": "Target Status",
    }

    # -------------------------------------------------
    # CHECK MISSING COLUMNS
    # -------------------------------------------------

    missing_columns = []

    first_row = production_rows[0]

    for column, label in required_columns.items():

        if column not in first_row:

            missing_columns.append(label)

    if missing_columns:

        return {
            "valid": False,
            "error_type": "INCOMPLETE_STRUCTURE",
            "message": (
                "The document contains Production data, "
                "but its structure is incomplete."
            ),
            "expected": ("Production data with all required fields."),
            "details": [f"Missing field: {column}" for column in missing_columns]
            + [
                "Please upload a complete Production Result document.",
                "The document was not inserted into the Production database.",
            ],
        }

    # -------------------------------------------------
    # CHECK REQUIRED DATA VALUES
    # -------------------------------------------------

    critical_fields = {
        "Unnamed: 1": "Start Production",
        "Unnamed: 2": "Finish Production",
        "Unnamed: 3": "Machine Name",
        "Unnamed: 4": "Product Name",
        "Unnamed: 5": "Total Planning",
        "Unnamed: 6": "Total Production",
        "Unnamed: 7": "Good Product",
        "Unnamed: 8": "Reject Product",
        "Unnamed: 9": "Downtime Minutes",
    }

    incomplete_rows = []

    for index, row in enumerate(
        production_rows,
        start=1,
    ):

        for column, label in critical_fields.items():

            value = row.get(column)

            if value is None or value == "":

                incomplete_rows.append(f"Row {index}: {label} is empty.")

    # -------------------------------------------------
    # INCOMPLETE DATA
    # -------------------------------------------------

    if incomplete_rows:

        return {
            "valid": False,
            "error_type": "INCOMPLETE_DATA",
            "message": (
                "The Production document was recognized, "
                "but some required values are missing."
            ),
            "expected": ("Complete Production Result records."),
            "details": incomplete_rows[:20]
            + [
                "Please complete the missing Production fields "
                "and upload the document again.",
                "The document was not inserted into the Production database.",
            ],
        }

    # =================================================
    # VALID PRODUCTION DOCUMENT
    # =================================================

    return {
        "valid": True,
        "error_type": None,
        "message": ("Production document validated successfully."),
        "details": [
            (f"{len(production_rows)} " "production records detected."),
            "All required Production fields are available.",
        ],
        "valid_rows": len(production_rows),
    }
