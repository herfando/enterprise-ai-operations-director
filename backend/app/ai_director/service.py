from .queries import AI_DECISION_QUERY


def get_ai_decision():

    # sementara test dulu
    # nanti di sini kita sambungkan Snowflake

    result = {
        "status": "success",
        "message": "AI Director service running",
        "query": AI_DECISION_QUERY
    }

    return result