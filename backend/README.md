# Backend (FastAPI)

## Run

```bash
# from backend/
.\start-backend.ps1
```

## Database (MySQL Workbench)

The backend is configured to run on MySQL by default.

1. Create a MySQL Workbench connection (for example, `curasync`).
2. Create both databases:

```sql
CREATE DATABASE IF NOT EXISTS curasync_core CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS curasync_tracking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Add a `.env` file in `backend/`:

```env
DATABASE_BACKEND=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_CORE_DATABASE=curasync_core
MYSQL_TRACKING_DATABASE=curasync_tracking
```

Optional SQLite fallback:

```env
DATABASE_BACKEND=sqlite
SQLITE_CORE_DB_URL=sqlite:///./data/curasync_core.db
SQLITE_TRACKING_DB_URL=sqlite:///./data/curasync_tracking.db
```

## What Is Added

- Real auth flow (register/login/refresh/logout/me), no mock login.
- Dual-database setup (`core` + `tracking`) with MySQL as default backend.
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
