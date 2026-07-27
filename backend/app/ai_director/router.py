from fastapi import APIRouter

from .service import get_ai_decision


router = APIRouter(
    prefix="/ai",
    tags=["AI Director"]
)


@router.get("/director")
def ai_director():

    result = get_ai_decision()

    return result