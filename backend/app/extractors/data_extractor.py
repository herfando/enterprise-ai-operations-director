import re


def find_number(patterns, text):

    for pattern in patterns:

        result = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if result:
            return result.group(1)

    return None



def extract_operational_data(text):

    data = {}

    text = text.lower()



    output = find_number(
        [
            r"output\s*[:=]?\s*(\d+)",
            r"production output\s*[:=]?\s*(\d+)",
            r"qty\s*[:=]?\s*(\d+)"
        ],
        text
    )


    if output:
        data["output"] = output



    oee = find_number(
        [
            r"oee\s*[:=]?\s*(\d+\.?\d*)",
            r"overall equipment effectiveness\s*[:=]?\s*(\d+\.?\d*)"
        ],
        text
    )


    if oee:
        data["oee"] = oee



    availability = find_number(
        [
            r"availability\s*[:=]?\s*(\d+\.?\d*)",
            r"machine availability\s*[:=]?\s*(\d+\.?\d*)"
        ],
        text
    )


    if availability:
        data["availability"] = availability



    performance = find_number(
        [
            r"performance\s*[:=]?\s*(\d+\.?\d*)",
            r"machine performance\s*[:=]?\s*(\d+\.?\d*)"
        ],
        text
    )


    if performance:
        data["performance"] = performance



    quality = find_number(
        [
            r"quality\s*[:=]?\s*(\d+\.?\d*)",
            r"product quality\s*[:=]?\s*(\d+\.?\d*)"
        ],
        text
    )


    if quality:
        data["quality"] = quality



    downtime = find_number(
        [
            r"downtime\s*[:=]?\s*(\d+)",
            r"machine downtime\s*[:=]?\s*(\d+)"
        ],
        text
    )


    if downtime:
        data["downtime"] = downtime



    return data