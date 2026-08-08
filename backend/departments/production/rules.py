# =====================================================
# PRODUCTION DOCUMENT VALIDATION RULES
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
            "details": ["No parser result was returned."],
        }

    rows = parser_result.get("data")

    if not rows:

        return {
            "valid": False,
            "error_type": "NO_DATA",
            "message": ("The document does not contain readable data."),
            "details": ["No data rows were found."],
        }

    # -------------------------------------------------
    # 2. DETECT PRODUCTION ROWS
    # -------------------------------------------------

    production_rows = []

    for row in rows:

        if not isinstance(row, dict):
            continue

        if isinstance(row.get("DATA HASIL PRODUKSI"), int):
            production_rows.append(row)

    # -------------------------------------------------
    # 3. NOT A PRODUCTION DOCUMENT
    # -------------------------------------------------

    if not production_rows:

        return {
            "valid": False,
            "error_type": "NOT_PRODUCTION_DOCUMENT",
            "message": (
                "This document is not suitable " "for the Production Dashboard."
            ),
            "expected": (
                "A Production Result / Production Report "
                "containing production performance data."
            ),
            "details": [
                "No production records were detected.",
                (
                    "Required production data includes "
                    "Machine, Product, Planning, Production, "
                    "Good Product, Reject Product, and Downtime."
                ),
            ],
        }

    # -------------------------------------------------
    # 4. REQUIRED STRUCTURE
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
    # 5. CHECK MISSING COLUMNS
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
                "The document contains production data, "
                "but its structure is incomplete."
            ),
            "expected": ("Production data with all required fields."),
            "details": [f"Missing field: {label}" for label in missing_columns],
        }

    # -------------------------------------------------
    # 6. CHECK REQUIRED DATA VALUES
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

    for index, row in enumerate(production_rows, start=1):

        for column, label in critical_fields.items():

            value = row.get(column)

            if value is None or value == "":

                incomplete_rows.append(f"Row {index}: {label} is empty.")

    # -------------------------------------------------
    # 7. RETURN INCOMPLETE DATA ERROR
    # -------------------------------------------------

    if incomplete_rows:

        return {
            "valid": False,
            "error_type": "INCOMPLETE_DATA",
            "message": (
                "The document is recognized as "
                "production data, but some required "
                "values are missing."
            ),
            "expected": ("Complete production records."),
            "details": incomplete_rows[:20],
        }

    # -------------------------------------------------
    # 8. VALID PRODUCTION DOCUMENT
    # -------------------------------------------------

    return {
        "valid": True,
        "error_type": None,
        "message": ("Production document " "validated successfully."),
        "details": [
            (f"{len(production_rows)} " "production records detected."),
            "Required production fields are available.",
        ],
        "valid_rows": len(production_rows),
    }
