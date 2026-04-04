# Backend (FastAPI)

## Run

```bash
# from backend/
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## What Is Added

- Real auth flow (register/login/refresh/logout/me), no mock login.
- SQLite dual-database setup for development/testing:
  - `backend/data/curasync_core.db`
  - `backend/data/curasync_tracking.db`
- Plan + subscription APIs (Current/Pro).
- AQI snapshot APIs.
- Risk/health tracking APIs (sleep/activity/vitals/events).
- Restaurant interaction logging APIs.

## Main API Prefix

- `/api/auth/*`
- `/api/plans/*`
- `/api/aqi/*`
- `/api/risk/*`
- `/api/restaurant/*`
