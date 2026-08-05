# API Design

## 1. API Overview

This document defines the RESTful API specification for the **Assignment & Submission Management System**. It standardizes communication between the **Next.js frontend** and the **ASP.NET Core Web API** backend while ensuring consistency, security, and maintainability.

The API follows REST principles, uses JSON for request/response payloads, and implements JWT-based authentication with Role-Based Access Control (RBAC).


## 2. Design Principles

- **RESTful Architecture:** Resource-oriented endpoints with standard HTTP methods.
- **Stateless Communication:** Each request contains all required authentication information.
- **Consistent API Structure:** Uniform request and response formats.
- **Role-Based Authorization:** Endpoint access controlled by user roles.
- **Input Validation:** All incoming data validated before business logic execution.
- **Meaningful Status Codes:** Standard HTTP response codes for every operation.
- **Versioned API:** URI-based versioning for future compatibility.


## 3. Base URL

### Development:

```http
http://localhost:5000/api/v1
```

### Production:

```http
https://api.example.com/api/v1
```



## 4. Authentication

### Authentication Scheme

```
Bearer Token (JWT)
```

### Authorization Header

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Authentication is required for all protected endpoints except login.


## 5. Standard Request Headers

| Header | Required | Description |
| :--- | :---: | :--- |
| Content-Type: application/json | ✅ | Request payload format |
| Accept: application/json | ✅ | Expected response format |
| Authorization: Bearer {token} | Protected APIs | JWT Access Token |


## 6. Standard Response Format

### Success Response:

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalRecords": 50,
    "totalPages": 5
  }
}
```


## 7. Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format."
    }
  ],
  "timestamp": "2026-08-05T10:15:30Z"
}
```


## 8. API Endpoints

### 8.1 Authentication

### Login:

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/auth/login` |
| Authentication | Public |

### Request

```json
{
  "email": "teacher@school.com",
  "password": "Password123!"
}
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```


### 8.2 Users

### Create User

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/users` |
| Authentication | Admin |

### Request:

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "Student",
  "classId": "UUID"
}
```


### Get All Users

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/users?page=1&pageSize=10` |
| Authentication | Admin |



### Get User

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/users/{id}` |
| Authentication | Admin, Self |


### Update User

| Property | Value |
| :--- | :--- |
| Method | PUT |
| Endpoint | `/users/{id}` |
| Authentication | Admin |


### Delete User

| Property | Value |
| :--- | :--- |
| Method | DELETE |
| Endpoint | `/users/{id}` |
| Authentication | Admin |



### 8.3 Classes

### Create Class

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/classes` |
| Authentication | Admin |

### Request

```json
{
  "name": "Grade 10",
  "section": "A"
}
```



### Get All Classes

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/classes` |
| Authentication | Admin, Teacher |

---

### Get Class

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/classes/{id}` |
| Authentication | Admin, Teacher |



### Update Class

| Property | Value |
| :--- | :--- |
| Method | PUT |
| Endpoint | `/classes/{id}` |
| Authentication | Admin |



### Delete Class

| Property | Value |
| :--- | :--- |
| Method | DELETE |
| Endpoint | `/classes/{id}` |
| Authentication | Admin |


### 8.4 Subjects

### Create Subject

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/subjects` |
| Authentication | Admin |

### Request

```json
{
  "classId": "UUID",
  "name": "Physics",
  "code": "PHY101"
}
```


### Get All Subjects

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/subjects?classId={id}` |
| Authentication | Admin, Teacher, Student |


### Get Subject

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/subjects/{id}` |
| Authentication | Admin, Teacher, Student |


### Update Subject

| Property | Value |
| :--- | :--- |
| Method | PUT |
| Endpoint | `/subjects/{id}` |
| Authentication | Admin |

---

### Delete Subject

| Property | Value |
| :--- | :--- |
| Method | DELETE |
| Endpoint | `/subjects/{id}` |
| Authentication | Admin |


### 8.5 Teacher Subjects

### Assign Teacher

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/teacher-subjects` |
| Authentication | Admin |

### Request

```json
{
  "teacherId": "UUID",
  "subjectId": "UUID"
}
```


### Get Teacher Subjects

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/teacher-subjects?teacherId={id}` |
| Authentication | Admin, Teacher |


### Remove Teacher Assignment

| Property | Value |
| :--- | :--- |
| Method | DELETE |
| Endpoint | `/teacher-subjects/{id}` |
| Authentication | Admin |

### 8.6 Assignments

### Create Assignment

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/assignments` |
| Authentication | Teacher |

### Request

```json
{
  "subjectId": "UUID",
  "title": "Midterm Physics Quiz",
  "description": "Complete problems 1 to 5.",
  "maxMarks": 100,
  "deadline": "2026-08-20T23:59:59Z"
}
```


### Get All Assignments

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/assignments?subjectId={id}` |
| Authentication | Admin, Teacher, Student |


### Get Assignment

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/assignments/{id}` |
| Authentication | Admin, Teacher, Student |


### Update Assignment

| Property | Value |
| :--- | :--- |
| Method | PUT |
| Endpoint | `/assignments/{id}` |
| Authentication | Teacher (Owner) |


### Publish Assignment

| Property | Value |
| :--- | :--- |
| Method | PATCH |
| Endpoint | `/assignments/{id}/publish` |
| Authentication | Teacher (Owner) |


### Close Assignment

| Property | Value |
| :--- | :--- |
| Method | PATCH |
| Endpoint | `/assignments/{id}/close` |
| Authentication | Teacher (Owner) |


### Delete Assignment

| Property | Value |
| :--- | :--- |
| Method | DELETE |
| Endpoint | `/assignments/{id}` |
| Authentication | Teacher (Owner), Admin |


## 8.7 Submissions

### Create Submission

| Property | Value |
| :--- | :--- |
| Method | POST |
| Endpoint | `/submissions` |
| Authentication | Student |

### Request

```json
{
  "assignmentId": "UUID",
  "submissionText": "Here is my solution.",
  "attachment": "answer.pdf"
}
```


### Get All Submissions

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/submissions?assignmentId={id}` |
| Authentication | Teacher |


### Get Submission

| Property | Value |
| :--- | :--- |
| Method | GET |
| Endpoint | `/submissions/{id}` |
| Authentication | Teacher, Student (Owner) |


### Update Submission

| Property | Value |
| :--- | :--- |
| Method | PUT |
| Endpoint | `/submissions/{id}` |
| Authentication | Student (Owner) |


### Grade Submission

| Property | Value |
| :--- | :--- |
| Method | PATCH |
| Endpoint | `/submissions/{id}/review` |
| Authentication | Teacher |

### Request

```json
{
  "obtainedMarks": 88.5,
  "teacherFeedback": "Well done. Good problem-solving approach."
}
```


## 8. Authorization Matrix

| Endpoint Group | Admin | Teacher | Student |
| :--- | :---: | :---: | :---: |
| `/auth/*` | Public | Public | Public |
| `/users/*` | Full Access | Self Profile | Self Profile |
| `/classes/*` | Full Access | Read Only | Read Only |
| `/subjects/*` | Full Access | Read Only | Read Only |
| `/teacher-subjects/*` | Full Access | Read Assigned | No Access |
| `/assignments/*` | Full Access | Manage Own | Read Published |
| `/submissions/*` | Read Only | Review Assigned | Own Submissions |


## 9. Validation Rules

- Email must be a valid email address.
- Password must contain at least 8 characters.
- Password must include uppercase, lowercase, number, and special character.
- Assignment deadline must be a future date.
- Assignment maximum marks must be greater than zero.
- Obtained marks must be between **0** and **maxMarks**.
- One submission is allowed per student per assignment.
- Required fields cannot be empty.


## 10. HTTP Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 OK | Request completed successfully |
| 201 Created | Resource created successfully |
| 204 No Content | Resource deleted successfully |
| 400 Bad Request | Validation failed |
| 401 Unauthorized | Authentication failed |
| 403 Forbidden | Permission denied |
| 404 Not Found | Resource not found |
| 409 Conflict | Duplicate resource or business rule violation |
| 500 Internal Server Error | Unexpected server error |


## 11. Pagination, Filtering & Sorting

### Pagination

```text
?page=1&pageSize=10
```

### Filtering

```text
?role=Student
?status=Published
?subjectId={id}
```

### Sorting

```text
?sortBy=createdAt&sortOrder=asc
```


## 12. API Versioning

- URI-based versioning (`/api/v1`)
- Breaking changes will be introduced under `/api/v2`
- Backward compatibility should be maintained whenever possible.


## 13. Swagger Documentation

Swagger/OpenAPI documentation is available during development.

```text
/swagger
```


## 14. Health Check

```http
GET /health
```

Returns the current API health status.


## 15. Future Improvements

- Refresh Token Authentication
- API Rate Limiting
- Redis Caching
- Background Job Processing
- Audit Logging
- Request Correlation ID
- Email Notifications
- API Monitoring & Metrics
