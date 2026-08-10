# Tests

Placeholder test structure. Unit tests go under `tests/unit/<feature>/` and integration tests under `tests/integration/<feature>/`.

A dedicated test project (e.g. xUnit) will be added when the first feature is implemented. Until then, each directory contains only a `.gitkeep`.

## Conventions

- Unit tests: cover individual use cases and validators in isolation (mocked repositories).
- Integration tests: cover real HTTP endpoints with an in-memory or test PostgreSQL database.