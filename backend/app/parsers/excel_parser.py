import pandas as pd


def extract_excel_text(file_path):

    sheets = pd.read_excel(
        file_path,
        sheet_name=None
    )

    text=[]


    for sheet_name, dataframe in sheets.items():

        text.append(
            f"Sheet: {sheet_name}"
        )

        text.append(
            dataframe.to_string()
        )


    return "\n".join(text)