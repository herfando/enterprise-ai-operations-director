from app.database.service import execute_query

from .queries import AI_DECISION_QUERY


def get_ai_decision():

    result = execute_query(AI_DECISION_QUERY)

    return {

        "status": "success",

        "total_decisions": len(result),

        "data": result

    }