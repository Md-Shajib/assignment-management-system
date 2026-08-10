# Tests

Automated test suite for the backend, hosted in the `AssignmentManagement.Tests` xUnit project:

- `Unit/` — isolated tests of use cases and validators (mocked repositories via Moq) and shared utilities. Organized per feature (`Auth`, `Assignment`, `Submission`, `Shared`).
- `Integration/` — real HTTP endpoint tests using `WebApplicationFactory<Program>` backed by an in-memory SQLite database (`SKIP_DATABASE_INITIALIZATION=true` bypasses the startup migration/seeder; the schema is created with `EnsureCreated`).

## Run

```bash
dotnet test
```