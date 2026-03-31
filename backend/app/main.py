from fastapi import FastAPI

app = FastAPI(title="Health Companion API")


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "Health Companion backend is running"}