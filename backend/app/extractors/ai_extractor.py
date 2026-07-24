from app.prompts.router import PROMPTS


def extract_operational_data(
    department: str,
    text: str
):
    prompt = PROMPTS.get(
        department,
        "Extract operational data."
    )

    return {
        "department": department,
        "prompt": prompt,
        "raw_text": text
    }