from app.database.service import execute_query

sql = """
SELECT *
FROM AI_OPERATIONS.AI_RESULTS.AI_DECISION_ENGINE
ORDER BY OEE ASC;
"""

data = execute_query(sql)

for row in data:
    print(row)