/** A row of `GET /courses` (docs/04-API-DESIGN.md §8.3). */
export interface Course {
  id: string;
  name: string;
  code?: string | null;
  teacherId?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}
