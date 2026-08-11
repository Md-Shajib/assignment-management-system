# Deployment

Containerized deployment for the Assignment & Submission Management System.

## Layout

- `backend/deployment/Dockerfile` — multi-stage build for the ASP.NET Core API (SDK → publish → `aspnet:9.0` runtime, listens on port 8080).
- `frontend/Dockerfile` — multi-stage build for the Next.js 16 frontend (standalone output, port 3000).
- `docker-compose.yml` (repo root) — wires together `postgres:16`, the API, and the frontend.
- `backend/.dockerignore` / `frontend/.dockerignore` — keep build contexts lean.

## Run with Docker Compose

```bash
# 1. From the repo root, prepare environment values (real secrets).
cp .env.example .env

# 2. Build and start.
docker compose up --build

# 3. Verify.
curl http://localhost:5000/health          # backend
open http://localhost:3000                 # frontend
```

Compose maps the API to host port **5000** (matching `NEXT_PUBLIC_API_BASE_URL`'s default `http://localhost:5000/api`) and the frontend to host port **3000**.

## Behavior notes

- At startup the API applies pending EF migrations and seeds the default Admin (and optional demo data via `SEED_SAMPLE_DATA=true`) using `DatabaseSeeder` — no manual migration step.
- The `backend` service depends on `db` becoming healthy; the `frontend` service depends on the backend being healthy.
- PostgreSQL data persists in the `postgres-data` named volume.

## Build images individually

```bash
docker build -t assignment-backend -f backend/deployment/Dockerfile backend
docker build -t assignment-frontend frontend
```