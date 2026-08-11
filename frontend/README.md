# Frontend — Assignment & Submission Management System

Next.js App Router client for the Assignment & Submission Management System.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4 with design tokens
- TanStack Query (server state)
- React Hook Form + Zod (forms and validation)
- Lucide (icons)

## Prerequisites

- Node.js 22+
- pnpm 10 (`corepack enable`)

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000 and expects the API at the base URL below.

## Environment

| Variable | Default | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:5000/api/v1` | Base URL of the backend API |

Set it in `frontend/.env.local` for local development, or via the root `.env` when
running through `docker compose`. It is inlined at build time, so the Docker image
takes it as a build argument.

## Scripts

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Project structure

```text
src/
├── app/                  # App Router routes, layouts, error/loading boundaries
│   ├── (auth)/           # Unauthenticated routes (login)
│   └── (dashboard)/      # Authenticated routes inside the app shell
├── features/<feature>/   # api, components, hooks, schemas, services, store, types, utils
├── shared/               # api, components, hooks, lib, providers, types, utils, constants
├── styles/               # Global stylesheet and design tokens
└── config/               # API and navigation configuration
```

## Conventions

- Components render UI only; business logic lives in hooks and services.
- UI components never call the API directly — go through a feature service.
- Every API response is validated with Zod in `shared/api/http-client.ts`; each
  service passes the schema for its `data` payload.
- Route access is driven by `config/navigation.ts`, which the sidebar and the
  dashboard layout's role guard both read from.
- Never hardcode colors or type sizes — use the tokens defined in
  `src/styles/globals.css`.

The rules in `AGENTS.md` and `../.agents/` are authoritative, and `../docs` is the
single source of truth for the API and data model.

## Docker

```bash
docker build -t assignment-frontend \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1 .
```

Or run the full stack (database, API, frontend) from the repository root with
`docker compose up --build`.
