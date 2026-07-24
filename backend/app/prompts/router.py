from app.prompts.production import PRODUCTION_PROMPT
from app.prompts.finance import FINANCE_PROMPT
from app.prompts.maintenance import MAINTENANCE_PROMPT
from app.prompts.sales import SALES_PROMPT
from app.prompts.ppic import PPIC_PROMPT
from app.prompts.qcqa import QCQA_PROMPT
from app.prompts.warehouse import WAREHOUSE_PROMPT
from app.prompts.purchasing import PURCHASING_PROMPT
from app.prompts.safety import SAFETY_PROMPT
from app.prompts.rnd import RND_PROMPT


PROMPTS = {
    "Production": PRODUCTION_PROMPT,
    "Finance": FINANCE_PROMPT,
    "Maintenance": MAINTENANCE_PROMPT,
    "Sales": SALES_PROMPT,
    "PPIC": PPIC_PROMPT,
    "QCQA": QCQA_PROMPT,
    "Warehouse": WAREHOUSE_PROMPT,
    "Purchasing": PURCHASING_PROMPT,
    "Safety": SAFETY_PROMPT,
    "RnD": RND_PROMPT,
}