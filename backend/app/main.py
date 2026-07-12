from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from loguru import logger

app = FastAPI(title="TransitOps", version="1.0.0")

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

logger.info("TransitOps starting up...")

@app.get("/health")
async def health():
    return {"status": "ok", "app": "TransitOps"}
