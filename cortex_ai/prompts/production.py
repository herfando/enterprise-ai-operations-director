import json


def build_production_decision_prompt(production_data: dict) -> str:
    """
    Build prompt untuk Production AI Decision.

    production_data berasal dari hasil analisis dashboard.py.
    Cortex bertugas menentukan prioritas keputusan,
    bukan menghitung ulang dashboard.
    """

    return f"""
You are an AI Operations Director responsible for production decision-making.

Your task is to analyze the already-processed Production Dashboard data
and produce an EXECUTIVE PRODUCTION DECISION.

IMPORTANT:

The Production Dashboard has already calculated:
- Production achievement
- OEE
- Availability
- Performance
- Quality
- Yield
- Downtime analysis
- Reject analysis
- Machine achievement
- Material usage

DO NOT recalculate these metrics.

DO NOT simply repeat the dashboard.

Your responsibility is to determine:

1. What is the most critical production problem?
2. Which problem must management address FIRST?
3. Why should this problem receive the highest priority?
4. What immediate actions should be taken?
5. What follow-up actions should be taken?
6. What operational/business impact is expected?
7. How confident are you in this decision based on the available evidence?

DECISION PRIORITY:

Give higher priority to problems that have a direct impact on production output,
production achievement, downtime, machine stoppage, reject, quality,
or material availability.

Consider relationships between problems.

For example:

- High downtime causing production below plan
- Machine stoppage causing production loss
- Increasing reject causing quality loss
- Material shortage causing production interruption
- Low OEE caused by multiple operational problems

Do not treat every problem as equally important.

Choose the FIRST action management should take.

If multiple problems exist, rank them and explain why the first one
has the highest operational impact.

DO NOT invent information that does not exist in the supplied data.

Use only the supplied Production Dashboard data.

Return ONLY valid JSON using this structure:

{{
    "title": "Short executive decision title",
    "severity": "Critical | High | Medium | Low",
    "priority": "P1 | P2 | P3 | P4",
    "confidence": 0,
    "executive_summary": "Short management-level conclusion",
    "primary_problem": "The most important problem",
    "why_first": "Why this problem must be handled first",
    "evidence": [
        "Evidence from the production data",
        "Another relevant evidence"
    ],
    "business_impact": "Operational or business impact",
    "immediate_actions": [
        "First immediate action",
        "Second immediate action"
    ],
    "follow_up_actions": [
        "Follow-up action",
        "Another follow-up action"
    ],
    "recommendation": "Clear final AI recommendation",
    "expected_impact": "Expected operational improvement"
}}

CONFIDENCE RULE:

Confidence must represent how strongly the available production data
supports the decision.

Use a number between 0 and 100.

PRODUCTION DASHBOARD DATA:

{json.dumps(production_data, indent=2, default=str)}
"""
