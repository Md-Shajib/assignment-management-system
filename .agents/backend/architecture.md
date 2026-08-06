# Backend Architecture

Folder Structure:

```text
src/
├── Api/
│   ├── Controllers/
│   ├── Middleware/
│   └── Extensions/
├── Application/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Mappings/
│   ├── Services/
│   └── Validators/
├── Domain/
│   ├── Entities/
│   ├── Enums/
│   ├── Interfaces/
│   └── ValueObjects/
├── Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   ├── Authentication/
│   └── Services/
└── Shared/
    ├── Constants/
    ├── Exceptions/
    ├── Responses/
    └── Utilities/
```

Rules:

- Follow the layered architecture.
- Controllers handle HTTP requests and responses only.
- Business logic belongs in the Application layer.
- Domain contains only business entities and domain logic.
- Infrastructure handles persistence and external services.
- Shared contains reusable utilities and common types.
- Keep dependencies one-directional.
- Avoid tight coupling between layers.
