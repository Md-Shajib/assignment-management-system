/** A row of `GET /teachers`. The profile id equals the owning user id. */
export interface Teacher {
  id: string;
  userId: string;
  fullName: string;
  email: string;
}
