/**
 * The API signs tokens with `ClaimTypes.Role`, which is serialized to the JWT
 * payload under its full schema URI rather than the short `role` name.
 */
export const ROLE_CLAIM_URI = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) {
      return null;
    }
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const payload: unknown = JSON.parse(json);
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return null;
    }
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/** Reads the role claim, accepting either the schema URI or the short name. */
export function getRoleClaim(payload: JwtPayload): string | null {
  const value = payload[ROLE_CLAIM_URI] ?? payload.role;
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** A token without a usable `exp` claim is treated as expired. */
export function isTokenExpired(payload: JwtPayload): boolean {
  if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
    return true;
  }
  return payload.exp * 1000 <= Date.now();
}
