# Database Guidelines

Rules:

- Use Entity Framework Core.
- Manage schema changes through EF Core migrations only.
- Use UUIDs for primary keys where defined by the project.
- Use foreign keys to maintain referential integrity.
- Apply indexes where appropriate.
- Store timestamps in UTC.
- Never hard delete data when soft delete is required.
- Keep database access inside the Infrastructure layer.
- Never execute raw SQL unless absolutely necessary.
