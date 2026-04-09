# Codebase Map

This document explains the purpose of each important part of the repository so the project is easier to maintain and present.

## Root

- `docker-compose.yml`: Starts the frontend and backend containers together for local deployment.
- `README.md`: Project overview, architecture summary, setup, and talking points.

## Backend

Path: `mentally-backend/`

### Entry Point

- `main.py`: Creates the FastAPI app, applies CORS, mounts route groups, and exposes a health-check endpoint.

### Core

- `app/core/config.py`: Centralized environment-based configuration for app metadata, host/port, allowed origins, OpenAI key, and Firebase service account path.
- `app/core/auth.py`: Shared helpers for reading the Authorization header and verifying Firebase ID tokens.

### Models

- `app/models/models_user_auth.py`: Pydantic models for signup and login request bodies.
- `app/models/models_user_data.py`: Pydantic models for stored mental health data, user documents, and historical snapshots.
- `app/models/models_openai.py`: Pydantic models for OpenAI request payloads, including chatbot payload structure.

### Routes

- `app/routes/user/firebase_init.py`: Initializes Firebase Admin, Firestore, and Pyrebase clients.
- `app/routes/user/user.py`: User-focused API routes for signup, login, token validation, profile reads, profile updates, and snapshot history.
- `app/routes/user/snapshots.py`: Background snapshot creation logic that periodically stores mental health snapshots.
- `app/routes/openai/openai.py`: AI-backed endpoints for assessment summaries and chatbot responses.

### Tests

- `app/tests/user_test.py`: Legacy ad hoc request script. This is not a real automated test suite yet and should be replaced with FastAPI test client coverage.

### Infrastructure

- `Dockerfile`: Container definition for the backend service.
- `requirements.txt`: Python dependencies.

## Frontend

Path: `mentally-frontend/`

### App Shell

- `src/index.jsx`: React entry point. Mounts the app and wraps routing in `BrowserRouter`.
- `src/App.jsx`: Top-level route table for page navigation.

### Pages

- `src/pages/Landing.jsx`: Marketing-style landing page and first CTA into the assessment flow.
- `src/pages/StarterTest.jsx`: Intro assessment flow for the PHQ-9 style questionnaire before signup.
- `src/pages/SignUp.jsx`: Account creation flow. After signup, it logs the user in and optionally persists starter PHQ data.
- `src/pages/LogIn.jsx`: Authentication flow for returning users.
- `src/pages/Account.jsx`: Main dashboard. Fetches current user data, snapshot history, and renders score summaries and data visualizations.
- `src/pages/MentalHealthTests.jsx`: Assessment runner for mental health tests selected from the dashboard.
- `src/pages/EmotionTests.jsx`: Assessment runner for emotion-specific tests.
- `src/pages/ChatBot.jsx`: Conversational AI interface using the user’s saved mental health profile.
- `src/pages/NotFound.jsx`: Fallback route for unknown paths.

### Components

- `src/components/mcq.jsx`: Reusable multiple-choice question component used in assessment flows.
- `src/components/ui/calendar.jsx`: Calendar visualization for historical user snapshots.
- `src/components/ui/linegraph.jsx`: Trend chart for time-series mental health data.

### Utilities

- `src/utils/api/client.js`: Shared Axios client and API error parsing helper.
- `src/utils/api/user.js`: Frontend wrappers around backend user endpoints.
- `src/utils/api/openai.js`: Frontend wrappers around backend OpenAI endpoints.
- `src/utils/storage.js`: Shared localStorage access for authenticated user data.
- `src/utils/util.js`: Small browser utilities such as sleep and typewriter animation.
- `src/utils/mental-health-tests.json`: Static dataset for assessment prompts, response options, and descriptions.

### Styling And Assets

- `src/styles/index.css`: Global Tailwind imports and base styles.
- `public/`: Standard CRA static assets and HTML shell.

### Infrastructure

- `package.json`: Frontend dependencies and scripts.
- `tailwind.config.js`: Tailwind theme configuration.
- `postcss.config.js`: PostCSS configuration.
- `Dockerfile`: Container definition for the frontend.

## Architectural Boundaries

- The frontend should only know about backend HTTP contracts, not Firebase internals.
- The backend is responsible for auth verification, Firestore writes, and AI provider calls.
- Firebase Authentication identifies the user.
- Firestore stores the user document and time-series snapshots.
- OpenAI is only called by the backend, never directly by the browser.

## Current Gaps

- No robust automated backend or frontend tests.
- The snapshot scheduler is still route-local and would be better extracted into a dedicated service module.
- Some large React pages still mix data-fetching and presentation concerns.
- The project still uses Create React App rather than a more modern frontend toolchain.
