# Project Assumptions & Design Decisions

> This document captures architectural assumptions, inferred business rules, and design decisions made where the project specification does not explicitly define the expected behavior.

---

## 1. General Assumptions

- Each user has exactly one role: **Admin**, **Teacher**, or **Student**.
- A **Student** can be enrolled in multiple courses, or subjects simultaneously.
- Student Enrollment: Admin manages Student-to-Course associations (via user updates or course enrollment) so students
only see their relevant assignments.
- Teachers can be assigned to manage multiple classes/subjects.
- Teachers can only manage assignments for classes/subjects explicitly assigned to them by the Admin.
- Students can only view and interact with assignments belonging to the classes/subjects they are actively enrolled in.
- All system timestamps are stored in UTC.

---

## 2. Assignment Lifecycle & Business Rules

- An assignment is created in **Draft** state by default.
- Only **Published** assignments are visible to students.
- Draft assignments cannot receive submissions.
- A published assignment cannot be reverted to Draft if student submissions already exist.
- Assignments with existing submissions cannot be hard-deleted (Soft-delete or archiving is used to preserve academic records).
- Assignment title must be unique within the same class and subject context.

---

## 3. Submission Rules

- Each student is allowed only one active submission per assignment.
- Submissions can contain text responses, external links, or single-file attachments (e.g., PDF/Zip up to 10MB).
- Students may update their submission unlimited times prior to the deadline; the latest submission overwrites the previous version.
- Empty submissions (no text content and no file attached) are rejected.
- Every submission tracks both `CreatedAt` and `UpdatedAt` timestamps.

---

## 4. Deadline & Late Submission Rules

- Assignment deadlines are mandatory and must be set to a future UTC date/time during creation.
- **Submission Modes:**
  - **Strict Deadline:** Submissions are strictly prohibited once the deadline passes.
  - **Allow Late Submission:** Teachers can optionally enable late submissions by defining a grace period or a "Late Submission End Date". Students submitting after the main deadline but before this end date will be marked as **Late Submitted**.
- Submissions are fully blocked once the late submission window closes or if late submission is disabled.
- Teachers can extend the deadline or late submission window for an assignment at any time. Extending the timeline allows pending students to submit or update their work.

---

## 5. Marking & Feedback Rules

- Only the assigned teacher (or Admin) can evaluate and mark submissions.
- Awarded marks cannot exceed the assignment's defined maximum marks.
- Maximum marks cannot be modified for an assignment if graded submissions already exist.
- Feedback is optional but allowed during grading.
- Upon grading, the submission status transitions from `Submitted` to `Graded`.
- Teachers can update/edit marks and feedback after initial submission grading.

---

## 6. Access Control & Permissions Matrix

### Admin
- Full CRUD access over users (Students, Teachers, Admins).
- Manage classes, courses, subjects, and student enrollments.
- Assign teachers to classes and subjects.
- Global read-only visibility over all assignments and submissions.

### Teacher
- Full management over their own assigned classes/subjects.
- Create, edit, publish, and soft-delete their own assignments.
- View, grade, and provide feedback on submissions for their assigned classes.

### Student
- View enrolled classes, subjects, and relevant published assignments.
- Submit and update responses before the deadline for enrolled courses.
- View their own submission status, awarded marks, and teacher feedback only.

---

## 7. Security & Validation Assumptions

- Authentication is handled via stateless JWT (JSON Web Tokens).
- Fine-grained Role-Based Access Control (RBAC) is enforced at both API/Backend and UI levels.
- Passwords are securely hashed (e.g., BCrypt / ASP.NET Identity PasswordHasher).
- File uploads are validated server-side for restricted file extensions and file size limits.
- Sensitive configs and secrets are managed exclusively through environment variables.

---

## 8. Technical & Architectural Decisions

- Backend follows a layered/clean architecture pattern.
- RESTful API design standards are followed with clear status code conventions (200, 201, 400, 401, 403, 404, 500).
- UUIDs / GUIDs are used as primary database entity identifiers.
- Database integrity is maintained via foreign key relations and ORM migrations.
- Many-to-Many relationships (e.g., Student <-> Course/Subject enrollment) are normalized using join tables.

---

## 9. Out of Scope

- Email and real-time (WebSocket) notifications.
- Submission file versioning/history tracking.
- Multiple attachments per single submission.
- Parent/Guardian accounts and analytics dashboard.
- Attendance management and real-time plagiarism checking.