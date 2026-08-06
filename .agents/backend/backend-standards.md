# Backend Standards

Stack:

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- FluentValidation

Rules:

- Use dependency injection.
- Use asynchronous programming for all I/O operations.
- Keep controllers thin.
- Keep business logic inside services.
- Use DTOs for request and response models.
- Never expose domain entities directly through APIs.
- Use FluentValidation for request validation.
- Return consistent API responses.
- Use meaningful HTTP status codes.
- Log unexpected errors without exposing sensitive information.
