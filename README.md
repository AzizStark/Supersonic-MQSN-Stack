# HAI - MQSN Stack Application

A full stack application with a Quarkus backend and SolidJS frontend.

## Project Structure

- `backend/` - Quarkus Java backend
- `frontend/` - SolidJS frontend application

## Setup

Install all dependencies with a single command:

```bash
npm run install-deps
```

This will install:
- Root level dependencies (concurrently)
- Frontend dependencies

## Running the Application

To run both frontend and backend concurrently:

```bash
npm run dev
```

### Run Each Service Separately

To run only the backend:

```bash
npm run backend
```

To run only the frontend:

```bash
npm run frontend
```

## Development Access

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
