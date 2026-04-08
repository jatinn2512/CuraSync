# CuraSync (Health Companion)

CuraSync is a full-stack health assistant app with auth, dashboard tools, food risk scanning, instant risk alerts, profile medical data, and smartwatch sync logging.

## Implemented Features

- Public and auth routing:
  - `/`, `/home`, `/index.html` -> Home
  - `/login`, `/register` -> Auth pages
  - Protected routes for dashboard modules
- Login/session behavior:
  - Session refresh handling
  - Expired session redirect to `/`
  - Logout redirect to `/`
- Sidebar navigation includes `Instant Alert`
- Profile page:
  - Expanded medical form (height, weight, eyesight, disability, chronic conditions, allergies, smoking, alcohol, notes)
  - Camera autofill (QR + OCR text parsing)
- Instant Alert page:
  - Detailed medical form with N/A-friendly fields
  - Risk output percentages for Heart Attack, Asthma, Diabetes, Hypertension
  - History list on same page
  - Camera autofill support
- Food page:
  - Camera scan button
  - QR + OCR based dish hint detection
  - Fallback food risk estimate from image signals
  - Food scan/selection history integration
- Settings page:
  - Smartwatch integration UI
  - Bluetooth connect/disconnect attempt (browser support dependent)
  - Manual sensor sync form posting to backend
- In-app chatbot:
  - Floating assistant in authenticated layout for feature guidance

## AI/ML Stack and Algorithms

### Training and model artifacts (`ai_ml/`)
- Libraries: `scikit-learn`, `pandas`, `numpy`, `joblib`
- Models trained with `RandomForestClassifier`:
  - Diabetes model
  - Heart model
  - Asthma model

### Runtime risk logic
- `ai_ml/predict.py`:
  - Loads trained model artifacts when available
  - Uses `predict_proba` for probability outputs
  - Falls back to rule-based probability estimation if model unavailable
- Rule-based scoring:
  - Hypertension scoring from BP/BMI/activity/stress
  - Obesity scoring from BMI
  - AQI risk scoring and advice
- Instant Alert hybrid scoring (`backend/app/services/risk_service.py`):
  - Uses symptom, vitals, family history, lifestyle, and environment heuristics
  - Produces disease-wise risk percentages + reasons + overall risk

### Camera OCR and scan stack
- Browser `BarcodeDetector` for QR extraction
- Browser `TextDetector` for OCR text extraction (when supported)
- Image preprocessing before OCR:
  - grayscale + contrast enhancement
  - thresholding
- Structured text parser for key-value medical/food fields
- Food fallback vision heuristic:
  - basic color/saturation/brightness signal-based risk estimate

## Backend APIs (Key)

- Auth: `/api/auth/*`
- Risk:
  - `POST /api/risk/instant-alert`
  - `GET /api/risk/instant-alert/history`
  - `POST /api/risk/wearable-sync`
  - `GET /api/risk/overview`
- Restaurant/Food: `/api/restaurant/*`

## Local Development

## 1) Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\start-backend.ps1
```

Backend runs on `http://localhost:8000`.

## 2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Build/Validation Commands

```powershell
cd frontend
npm run build

cd ..\backend
py -3 -m compileall app
```

## Notes

- Smartwatch Bluetooth direct access depends on browser/device support. Manual sync still works and stores data.
- OCR text scanning depends on `TextDetector` support in the browser. QR scan and non-OCR fallbacks continue to work.

