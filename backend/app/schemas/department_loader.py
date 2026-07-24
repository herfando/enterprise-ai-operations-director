import json
import os


BASE_PATH = os.path.join(
    os.path.dirname(__file__),
    "../departments"
)


def load_department_schema(department_id: str):

    file_path = os.path.join(
        BASE_PATH,
        f"{department_id}.json"
    )

    if not os.path.exists(file_path):
        raise Exception(
            f"Department schema not found: {department_id}"
        )

    with open(
        file_path,
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)