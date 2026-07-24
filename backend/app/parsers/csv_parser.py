import pandas as pd


def extract_csv_text(file_path):

    dataframe = pd.read_csv(
        file_path
    )


    return dataframe.to_string()