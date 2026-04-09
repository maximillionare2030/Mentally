from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routes.user.user import router as user_router
from app.routes.user.snapshots import router as snapshot_router
from app.routes.openai.openai import router as openai_router
from app.core.config import get_settings


settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_title,
        description=settings.app_description,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(user_router, prefix="/user", tags=["user"])
    app.include_router(snapshot_router, prefix="/db", tags=["snapshots"])
    app.include_router(openai_router, prefix="/openai", tags=["openai"])

    @app.get("/", summary="Health check")
    def read_root():
        return {
            "status": "ok",
            "service": "mentally-backend",
        }

    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.api_host, port=settings.api_port, reload=True)
