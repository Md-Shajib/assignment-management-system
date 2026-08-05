# System Design

## 1. System Overview

The **Assignment & Submission Management System** is a production-grade, role-based educational web application designed for schools and colleges. It streamlines the complete assignment lifecycle by enabling administrators to manage academic structures, teachers to create and evaluate assignments, and students to submit coursework and track their academic progress.

The system follows a layered architecture with an **ASP.NET Core Web API** backend, a **Next.js (App Router)** frontend, a **PostgreSQL** database, and **Docker** for local development and deployment consistency.

---

## 2. Design Goals

- **Maintainability:** Modular architecture with clear separation of concerns.
- **Scalability:** Stateless backend services supporting horizontal scaling.
- **Security:** JWT-based authentication with role-based authorization.
- **Reliability:** Transaction-safe operations and centralized error handling.
- **Extensibility:** Easy integration of future modules without major architectural changes.

---

## 3. High-Level Architecture

```text
+----------------------+
|     Web Browser      |
+----------+-----------+
           |
           | HTTPS / REST
           v
+----------------------+
| Next.js Frontend     |
+----------+-----------+
           |
           | JWT Bearer Token
           v
+----------------------+
| ASP.NET Core API     |
|----------------------|
| Middleware           |
| Controllers          |
| Services             |
| Repositories         |
+----------+-----------+
           |
           | EF Core (ORM)
           v
+----------------------+
| PostgreSQL Database  |
+----------------------+
```

---

## 4. Technology Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| State Management | React Context / RTK Query |
| Backend | ASP.NET Core Web API (.NET 9), C# |
| ORM | Entity Framework Core |
| Database | PostgreSQL |
| Authentication | JWT, BCrypt |
| API Documentation | Swagger / OpenAPI |
| Containerization | Docker, Docker Compose |

---

## 5. Architectural Decisions

1. Monorepo architecture (`frontend/` and `backend/`).
2. Layered Architecture with Repository & Service Pattern.
3. Stateless JWT Authentication.
4. RESTful API design.
5. Database schema managed using EF Core Migrations.

---

## 6. System Modules

### 6.1 Authentication Module

- User login
- Password hashing
- JWT generation
- Authorization

### 6.2 User Management Module

- User CRUD
- Role assignment
- User status management

### 6.3 Class & Subject Management Module

- Class management
- Subject management
- Teacher assignment
- Student enrollment

### 6.4 Assignment Management Module

- Create assignment
- Update assignment
- Draft / Publish assignment
- Deadline management

### 6.5 Submission Management Module

- Assignment submission
- Submission update
- Deadline validation
- Submission status management

### 6.6 Evaluation & Feedback Module

- Review submissions
- Assign marks
- Provide feedback
- Update submission status

---

## 7. Request Flow

```text
+----------+      +------------+      +--------------+      +------------+
|   User   | ──▶ |  Frontend   | ──▶ | HTTP Request | ──▶ | Middleware |
+----------+      +------------+      +--------------+      +------------+
                                                                  │
                                                                  ▼
+-------------+      +--------+      +----------------+      +------------+
| Repository  | ◀── | Service | ◀── | DTO Validation | ◀── | Controller |
+-------------+      +--------+      +----------------+      +------------+
      │
      ▼
+-----------+      +------------+     +-------------+      +----------+
| DbContext | ──▶ | PostgreSQL | ──▶ | JSON Result | ──▶ | Frontend |
+-----------+      +------------+     +-------------+      +----------+
```
---

## 8. Authentication & Authorization Flow

```
+---------+         +----------------------+         +-------------------+         +---------------+
| Student |         | Next.js Frontend App |         | .NET Auth API     |         | PostgreSQL DB |
+----+----+         +----------+-----------+         +---------+---------+         +-------+-------+
     |                         |                               |                           |
     | 1. Submit Credentials   |                               |                           |
     |------------------------>|                               |                           |
     |                         | 2. POST /api/auth/login       |                           |
     |                         |------------------------------>|                           |
     |                         |                               | 3. Validate User & Pass   |
     |                         |                               |-------------------------->|
     |                         |                               | 4. Return User Record     |
     |                         |                               |<--------------------------|
     |                         | 5. Return JWT Token + Claims  |                           |
     |                         |<------------------------------|                           |
     |                         |                               |                           |
     | 6. Store JWT in Storage |                               |                           |
     |                         |                               |                           |
     | 7. Request Submissions  |                               |                           |
     | (Header: Bearer Token)  |                               |                           |
     |------------------------>| 8. GET /api/submissions       |                           |
     |                         | (Header: Bearer Token)        |                           |
     |                         |------------------------------>|                           |
     |                         |                               | 9. Validate JWT & Role    |
     |                         |                               | 10. Fetch Filtered Data   |
     |                         |                               |-------------------------->|
     |                         |                               |<--------------------------|
     |                         | 11. Render Data JSON          |                           |
     |                         |<------------------------------|                           |
```

---

## 9. Data Flow

### Assignment Creation

```text
Teacher
   │
   ▼
Frontend
   │
   ▼
Assignment DTO
   │
   ▼
Assignment Service
   │
   ▼
Database
```

### Student Submission

```text
Student
   │
   ▼
Frontend
   │
   ▼
Submission DTO
   │
   ▼
Submission Service
   │
   ▼
Deadline Validation
   │
   ▼
Database
```

### Teacher Evaluation

```text
Teacher
   │
   ▼
Review Submission
   │
   ▼
Evaluation Service
   │
   ▼
Database
```

---

## 10. Repository Structure

### Root

```text
assignment-management-system/
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

### Frontend

```text
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── hooks/
│   ├── lib/
│   └── utils/
```

### Backend

```text
backend/
├── Controllers/
├── Services/
├── Repositories/
├── DTOs/
├── Entities/
├── Data/
├── Middleware/
├── Configurations/
└── Program.cs
```

---

## 11. Design Patterns

- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Dependency Injection
- DTO Pattern
- Middleware Pattern

---

## 12. Error Handling Strategy

- Global Exception Middleware
- Standard API Response Format
- Validation Error Responses
- User-friendly Frontend Error Messages

---

## 13. Input Validation Strategy

### Backend

- Data Annotations
- FluentValidation

### Frontend

- React Hook Form
- Zod Validation

---

## 14. Logging Strategy

- Structured logging
- Request logging
- Exception logging
- Security event logging

---

## 15. Security Strategy

- JWT Authentication
- Role-Based Authorization
- Password Hashing (BCrypt)
- Secure Environment Variables
- CORS Policy
- SQL Injection Protection
- XSS Protection

---

## 16. Scalability Considerations

- Stateless API
- Database Indexing
- Async Operations
- Modular Architecture

---

## 17. Future Improvements

- Refresh Token Authentication
- File Storage Integration
- Real-time Notifications
- Audit Logs
- API Versioning
