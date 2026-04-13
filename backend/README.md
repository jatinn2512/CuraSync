# Backend (FastAPI)

## Run

```bash
# from backend/
.\start-backend.ps1
```

## Database (Supabase Postgres)

The backend is configured to run on Supabase Postgres.

1. In `backend/.env`, use:

```env
DATABASE_BACKEND=postgres
SUPABASE_DB_URL=postgresql+psycopg://postgres:your_supabase_db_password@db.your_project_ref.supabase.co:5432/postgres
```

2. Install backend dependencies (includes Postgres driver):

```bash
pip install -r requirements.txt
```

3. Start backend:

```bash
.\start-backend.ps1
```

Optional explicit split URLs (usually not needed):

```env
CORE_DB_URL=postgresql+psycopg://postgres:your_supabase_db_password@db.your_project_ref.supabase.co:5432/postgres
TRACKING_DB_URL=postgresql+psycopg://postgres:your_supabase_db_password@db.your_project_ref.supabase.co:5432/postgres
```

## What Is Added

- Real auth flow (register/login/refresh/logout/me), no mock login.
- Dual-session setup (`core` + `tracking`) targeting Supabase Postgres.
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

# readme just about cmnds etc 