/** A row of `GET /students`. A student is enrolled in at most one course. */
export interface Student {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  courseId?: string | null;
}
