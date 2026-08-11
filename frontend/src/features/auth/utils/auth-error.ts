/** Raised when a session cannot be established from an otherwise successful response. */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
