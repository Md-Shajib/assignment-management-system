# Assignment Management API (Backend)

ASP.NET Core Web API (.NET 9) backend for the Assignment & Submission Management System.

## Project Structure

```text
backend/
├── domain/                      # Business entities
├── assignment/                  # Assignment feature module
├── teacher/                     # Teacher feature module
├── student/                     # Student feature module
├── course/                      # Course feature module
├── submission/                  # Submission feature module
├── auth/                        # Authentication feature module
├── infrastructure/              # Persistence, repositories, authentication, DI
│   ├── database/
│   │   ├── configurations/
│   │   └── migrations/
│   ├── repositories/
│   └── authentication/
├── shared/                      # Cross-cutting concerns
│   ├── exceptions/
│   ├── middleware/
│   ├── responses/
│   ├── constants/
│   ├── extensions/
│   └── utilities/
├── tests/
│   ├── unit/
│   └── integration/
├── deployment/
├── AssignmentManagement.sln
├── AssignmentManagement.Api.csproj
└── Program.cs
```

Each feature module follows the same layout: `usecase/`, `repository/`, `delivery/`, `transformer/`, `dto/`, `validator/`.

## Data Flow with Authentication

```mermaid
sequenceDiagram
    actor Client
    participant Frontend as Next.js Frontend
    participant Delivery as AuthController
    participant UseCase as Auth Use Cases
    participant Infra as Infrastructure (Repositories / JwtService)
    participant DB as PostgreSQL

    Note over Client, DB: 1. Authentication
    Client->>Frontend: Login with email & password
    Frontend->>Delivery: POST /api/v1/auth/login
    Delivery->>UseCase: Execute login
    UseCase->>Infra: Find user by email
    Infra->>DB: SELECT user
    DB-->>Infra: User record (password hash)
    Infra-->>UseCase: Verify password (BCrypt)
    UseCase->>Infra: Generate JWT (JwtService)
    Infra-->>UseCase: Access token
    UseCase-->>Delivery: Login response
    Delivery-->>Client: 200 OK + JWT (Bearer)

    Note over Client, DB: 2. Authorized Request
    Client->>Frontend: Access protected resource
    Frontend->>Delivery: GET /api/v1/assignments (Authorization: Bearer <JWT>)
    Delivery->>Delivery: Validate JWT + role (JWT Middleware)
    opt Invalid / Expired Token
        Delivery-->>Client: 401 Unauthorized
    end
    opt Insufficient Role
        Delivery-->>Client: 403 Forbidden
    end
    Delivery->>UseCase: Execute operation
    UseCase->>Infra: Query / mutate via repository
    Infra->>DB: SQL (EF Core)
    DB-->>Infra: Result set
    Infra-->>UseCase: Domain entities
    UseCase-->>Delivery: Transformed DTO response
    Delivery-->>Client: 200 OK + JSON (ApiResponse)
```

## Request Flow (Folder Structure)

```mermaid
flowchart TD
    Client[Frontend - Next.js] -->|HTTP request + JWT| Program

    subgraph "backend/ root"
        Program["Program.cs\n(composes request pipeline)"]
    end

    subgraph Shared["shared/ middleware"]
        Middleware["ExceptionHandlingMiddleware\n+ JWT Authentication"]
    end

    subgraph Delivery["<feature>/ delivery/"]
        Controller["AssignmentController.cs"]
    end

    subgraph DtoValidator["<feature>/ dto/ + validator/"]
        DTO["CreateAssignmentRequest.cs"]
        Validator["CreateAssignmentValidator.cs"]
    end

    subgraph UseCase["<feature>/ usecase/"]
        UseCases["CreateAssignment.cs / GetAssignment.cs"]
    end

    subgraph Transformer["<feature>/ transformer/"]
        Transform["AssignmentRequestTransformer.cs"]
    end

    subgraph Iface["<feature>/ repository/"]
        IRepo["IAssignmentRepository.cs"]
    end

    subgraph InfraRepo["infrastructure/ repositories/"]
        EFRepo["AssignmentRepository.cs"]
    end

    subgraph Database["infrastructure/ database/"]
        DbCtx["ApplicationDbContext.cs"]
    end

    subgraph Domain["domain/"]
        Entity["Assignment.cs"]
    end

    PostgreSQL[("PostgreSQL Database")]

    Program --> Middleware
    Middleware -->|validate & authorize JWT| Controller
    Controller --> DTO
    DTO -->|validate| Validator
    Validator -->|valid request| UseCases
    UseCases --> Transform
    Transform --> IRepo
    IRepo --> EFRepo
    EFRepo --> DbCtx
    DbCtx --> PostgreSQL
    PostgreSQL -.->|row / entity| Domain
    Entity -.->|entity passed upward| IRepo
```
---
