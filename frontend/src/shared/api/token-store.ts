/**
 * Client-only session token holder. Module state is shared across requests on the
 * server, so this must never be read from a Server Component.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}