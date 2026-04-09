# Mentally

Mentally is a full-stack mental health tracking application with a React frontend and a FastAPI backend. Users can sign up with Firebase Authentication, complete mental health and emotion assessments, store results in Firestore, review historical snapshots, and request AI-generated guidance based on their scores.

## What The Project Does

- Collects PHQ-style and Beck inventory style assessment data.
- Tracks Ekman-inspired emotion scores across six emotions.
- Stores user profiles and mental health data in Firebase/Firestore.
- Generates historical snapshots for trend visualizations.
- Provides an AI assistant for score summaries and follow-up support.

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Axios, Chart.js
- Backend: FastAPI, Pydantic, Firebase Admin SDK, Pyrebase, OpenAI SDK
- Infrastructure: Docker Compose
- Data/Auth: Firebase Authentication and Firestore

## Repository Layout

- `mentally-frontend/`: React application, pages, UI components, API clients
- `mentally-backend/`: FastAPI service, models, route handlers, Firebase integration
- `docker-compose.yml`: Local orchestration for frontend and backend
- `docs/CODEBASE_MAP.md`: Folder-by-folder explanation of the codebase

## Core User Flow

1. A user lands on the marketing page and starts the initial PHQ-9 style assessment.
2. The user signs up or logs in.
3. The frontend exchanges credentials with the backend, which authenticates through Firebase.
4. The backend stores the user profile and mental health data in Firestore.
5. The account dashboard fetches current user data and historical snapshots.
6. The user can take additional tests or ask the AI assistant for guidance.

## Improvements In This Pass

- Centralized backend configuration and token parsing.
- Tightened backend CORS configuration to use explicit allowed origins.
- Added validation ranges for stored mental health scores.
- Standardized frontend API calls through a shared Axios client.
- Centralized browser storage helpers for authenticated user data.
- Removed several fragile navigation and error-handling patterns.
- Added repository documentation for architecture and code navigation.

## Local Development

### Frontend

Run from `mentally-frontend/`:

```bash
npm install
npm start
```

Required env:

- `REACT_APP_API_BASE_URL`

### Backend

Run from `mentally-backend/`:

```bash
pip install -r requirements.txt
python main.py
```

Common env:

- `REACT_APP_URL`
- `ALLOWED_ORIGINS`
- `OPENAI_API_KEY`
- Firebase config variables used in `app/routes/user/firebase_init.py`
- `FIREBASE_SERVICE_ACCOUNT_PATH` if the service account file is not stored next to `firebase_init.py`

### Docker

From the repo root:

```bash
docker compose up --build
```

## How To Describe This Project

Short version:

`Mentally is a full-stack mental health tracking app I built with React, FastAPI, Firebase, and OpenAI. It lets users authenticate, complete assessment flows, persist results, visualize historical trends, and receive AI-generated feedback based on their current mental health profile.`

Architecture version:

`The frontend is a client-side React application that manages routing, assessment flows, dashboard views, and API calls. The backend is a FastAPI service that handles auth-related operations, Firestore reads/writes, scheduled snapshots, and OpenAI-backed response generation. Firebase Authentication handles identity, and Firestore stores user profiles plus time-series mental health snapshots.`
