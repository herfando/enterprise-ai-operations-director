import json


def extract_operational_data(
    department: str,
    text: str
):
    """
    Temporary AI Extractor.

    Next version:
    Snowflake Cortex / CoCo AI
    """

    return {
        "department": department,
        "raw_text": text
    }