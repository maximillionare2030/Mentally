# Mentally Frontend

This frontend is a React single-page application for the Mentally project.

## Responsibilities

- Render the public landing page
- Run starter and authenticated assessment flows
- Handle sign-up and login
- Display dashboard metrics and historical charts
- Send chatbot and assessment-summary requests to the backend

## Key Directories

- `src/pages/`: Route-level screens
- `src/components/`: Reusable UI pieces
- `src/utils/api/`: Backend API wrappers
- `src/utils/`: Local browser helpers and assessment data
- `src/styles/`: Tailwind-powered global styles

## Scripts

- `npm start`: Start the development server
- `npm run build`: Build the production bundle
- `npm test`: Run the CRA test runner

## Environment

- `REACT_APP_API_BASE_URL`: Base URL of the FastAPI backend

## Notes

- The app currently uses Create React App.
- Auth state is persisted in `localStorage`.
- The frontend does not call Firebase or OpenAI directly; all server-side integration happens through the backend API.
