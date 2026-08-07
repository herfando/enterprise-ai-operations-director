from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.engine.workflow_engine import router as workflow_router
from backend.departments.production.dashboard import (
    router as production_dashboard_router,
)

app = FastAPI(title="Enterprise AI Operations Director")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://enterprise-ai-operations-director.vercel.app",
        "https://enterprise-ai-operations-director-q.vercel.app",
        "https://enterprise-ai-operations-director-q9dt-4ir3snllq.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# workflow upload endpoint
app.include_router(workflow_router)

# production dashboard endpoint
app.include_router(production_dashboard_router)


@app.get("/")
def root():
    return {"status": "Backend running"}
