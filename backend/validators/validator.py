from app.schemas.department_loader import load_department_schema


def validate_department_data(
    department: str,
    extracted_data: dict
):

    schema = load_department_schema(
        department.lower()
    )


    missing_fields = []


    required_fields = [
        field
        for field in schema["fields"]
        if field.get("required")
    ]


    for field in required_fields:

        field_id = field["id"]

        if field_id not in extracted_data:
            missing_fields.append(
                field_id
            )


    if missing_fields:

        return {
            "status": "incomplete",
            "department": schema["name"],
            "missing_data": missing_fields,
            "message": "Additional data required"
        }


    return {
        "status": "ready",
        "department": schema["name"],
        "message": "Data validation completed"
    }