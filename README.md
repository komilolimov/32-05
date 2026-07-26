# URL Async Status Checker

This is a fullstack web application for asynchronous background URL checking. It processes a list of URLs and checks their HTTP status using `HEAD` requests with a concurrency limit and simulated random latency.

## Features

- **Asynchronous Processing**: Background job execution limiting to maximum 5 concurrent requests.
- **Artificial Delay**: Each HEAD request is artificially delayed by a random amount of time (0-10 seconds).
- **Graceful Cancellation**: Cancel pending requests immediately without interrupting in-flight URLs.
- **FSD Architecture**: The frontend is built using Feature-Sliced Design.
- **State Management**: Built-in race-condition-safe polling and robust global state with Zustand.
- **Dockerized**: Fully production-ready multi-stage Docker builds.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS v4, Zustand, Vitest + React Testing Library
- **Backend**: Node.js, Express, TypeScript, Zod, Axios, p-limit
- **DevOps**: Docker, Docker Compose, Nginx

## Running with Docker (Recommended)

1. Ensure you have Docker and Docker Compose installed.
2. In the root of the project, run:
```bash
docker-compose up --build
```
3. Open the app in your browser: [http://localhost:3000](http://localhost:3000)

## Running Locally (Development)

### Backend
```bash
cd backend
npm install
npm run dev
```
The backend will run on http://localhost:3001.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on http://localhost:5173.

### Running Tests
The frontend includes a deterministic Vitest setup to verify polling behavior and anti-race condition protections.
```bash
cd frontend
npm run test
```

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/api/jobs` | Create a new job. Body: `{ "urls": ["http://ex.com"] }` |
| **GET**  | `/api/jobs` | Get list of all jobs with stats summary |
| **GET**  | `/api/jobs/:id` | Get detailed URL status for a specific job |
| **DELETE** | `/api/jobs/:id` | Cancel the specified job (aborts pending URLs) |
