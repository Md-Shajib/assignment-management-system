# Assignment & Submission Management System

A **production-ready role-based full-stack web application** for managing academic assignments, submissions, and evaluations in schools and colleges. Developed as part of the **Assistant Software Engineer Recruitment Project** for **OnnoRokom Projukti Limited**.

---

# 📖 Overview

The Assignment & Submission Management System streamlines the entire assignment workflow for educational institutions through dedicated **Admin**, **Teacher**, and **Student** portals.

The application follows a modern full-stack architecture with:

- **Next.js (App Router)** frontend
- **ASP.NET Core Web API (.NET 9)** backend
- **PostgreSQL** database
- **JWT Authentication** with Role-Based Access Control (RBAC)
- **Docker & Docker Compose** for local development
- **Swagger/OpenAPI** for API documentation

---

# ✨ Features

## 🔐 Role-Based Access Control (RBAC)

### 👨‍💼 Admin

- Manage users
- Manage classes/courses
- Manage subjects
- Assign teachers to subjects
- Manage student course enrollments
- View all assignments and submissions across the system

### 👨‍🏫 Teacher

- Create assignments
- Save assignments as drafts or publish them
- Set submission deadlines
- Configure maximum marks
- Allow or restrict late submissions
- Review student submissions
- Grade submissions
- Provide feedback

### 👨‍🎓 Student

- View assignments for enrolled courses
- Submit assignment responses
- Upload optional attachments or external links
- Update submissions before the deadline
- Track marks and teacher feedback

---

# 🛠 Tech Stack

| Category | Technology |
| :------- | :--------- |
| **Frontend** | Next.js (App Router), React, TypeScript, Tailwind CSS |
| **Backend** | ASP.NET Core Web API (.NET 9), Entity Framework Core, REST API |
| **Database** | PostgreSQL |
| **Authentication** | JWT, Role-Based Access Control (RBAC) |
| **Containerization** | Docker, Docker Compose |
| **API Documentation** | Swagger / OpenAPI |

---

# 🏗 Architecture

```text
                ┌────────────────────┐
                │   Next.js Frontend │
                └──────────┬─────────┘
                           │ REST API
                           ▼
           ┌───────────────────────────────┐
           │ ASP.NET Core Web API (.NET 8) │
           └──────────────┬────────────────┘
                          │ EF Core
                          ▼
                ┌────────────────────┐
                │     PostgreSQL     │
                └────────────────────┘
```

---

# 📁 Repository Structure

```text
assignment-management-system/
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── services/
│
├── docs/
│   └── Project-Assumptions.md
│
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 📋 Prerequisites

Make sure the following tools are installed before running the project:

- Docker Desktop
- .NET 9 SDK *(Optional if using Docker)*
- Node.js v24 or later *(Optional if using Docker)*
- PostgreSQL *(Required only for manual setup)*

---

# 🚀 Local Setup

## Option 1: Run with Docker Compose (Recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/Md-Shajib/assignment-management-system.git
cd assignment-management-system
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values inside the `.env` file.

### 3. Build and Start All Services

```bash
docker-compose up --build -d
```

> **Note:** The initial build may take a few minutes depending on your machine.

### 4. Verify Running Services

```bash
docker-compose ps
```

### 5. Access the Application

| Service | URL |
| :------ | :-- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger UI | http://localhost:5000/swagger |

### 6. Stop All Services

```bash
docker-compose down
```

---

## Option 2: Manual Local Setup
Before proceeding, clone the repository, create a `.env` file from `.env.example`, and configure the required environment variables.

### 1. Database Setup (PostgreSQL)

Create a PostgreSQL database:

```sql
-- Create database (e.g., assignment_db matching POSTGRES_DB in .env)
CREATE DATABASE assignment_db;
```

### 2. Backend Setup

```bash
cd backend

# Restore dependencies
dotnet restore

# Apply EF Core migrations
dotnet ef database update

# Run the API
dotnet run
```

The backend API will be available at:

```
http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at:

```
http://localhost:3000
```

---

# 🔗 Live Demo

| Resource | URL |
| :------- | :-- |
| Frontend | Coming Soon |
| Backend API | Coming Soon |
| Swagger Documentation | Coming Soon |

---

# 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :---- | :------- |
| **Admin** | `admin@school.com` | `Admin@123!` |
| **Teacher** | `teacher@school.com` | `Teacher@123!` |
| **Student** | `student@school.com` | `Student@123!` |

---

# 📚 Documentation

Detailed business rules, architectural decisions, assumptions, and edge-case handling are documented in:

```text
assignment-management-system/docs/
```

---

# 📌 Business Rules

The system follows the following business rules:

- Role-based authorization using JWT
- Draft and published assignment workflow
- Deadline validation for assignment submissions
- Optional late submission support
- Assignment grading and teacher feedback
- Student enrollment-based assignment visibility
- Secure access control for all resources

---

# 📝 License

This project was developed as part of the **Assistant Software Engineer Recruitment Project** for **OnnoRokom Projukti Limited** and is intended for evaluation purposes.
