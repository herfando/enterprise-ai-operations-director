from .department_rules import DEPARTMENT_RULES


def validate_department_data(
    department:str,
    extracted_data:dict
):

    required_fields = DEPARTMENT_RULES.get(
        department,
        []
    )


    missing = []


    for field in required_fields:

        if field not in extracted_data:
            missing.append(field)


    if missing:

        return {
            "status":"incomplete",
            "department":department,
            "missing_data":missing,
            "message":
            "Additional data required"
        }


    return {
        "status":"ready",
        "department":department,
        "message":
        "Data validation completed"
    }