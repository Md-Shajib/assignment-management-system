"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "@/shared/api/token-store";
import { setUnauthorizedHandler } from "@/shared/api/unauthorized-handler";
import { STORAGE_KEYS } from "@/shared/constants";
import { decodeJwt, getRoleClaim, isTokenExpired } from "@/shared/utils/jwt";
import { authService } from "../services/auth-service";
import { AuthError } from "../utils/auth-error";
import type { AuthUser, LoginRequest, UserRole } from "../types";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function toUserRole(raw: string | null): UserRole | null {
  if (raw === "Admin" || raw === "Teacher" || raw === "Student") {
    return raw;
  }
  return null;
}

/** Builds the session user, or null when the token is unusable or expired. */
function buildAuthUser(token: string): AuthUser | null {
  const claims = decodeJwt(token);
  if (!claims || isTokenExpired(claims)) {
    return null;
  }

  const id = typeof claims.sub === "string" ? claims.sub : "";
  const role = toUserRole(getRoleClaim(claims));
  if (!id || !role) {
    return null;
  }

  return {
    id,
    email: typeof claims.email === "string" ? claims.email : "",
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    window.localStorage.removeItem(STORAGE_KEYS.accessToken);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(STORAGE_KEYS.accessToken);
    const storedUser = storedToken ? buildAuthUser(storedToken) : null;

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- rehydrate persisted session from localStorage on mount
      setUser(storedUser);
    } else if (storedToken) {
      window.localStorage.removeItem(STORAGE_KEYS.accessToken);
    }

    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    queryClient.clear();
  }, [clearSession, queryClient]);

  // Drop the session as soon as the API rejects an authenticated request.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthUser> => {
    const response = await authService.login(credentials);
    const nextUser = buildAuthUser(response.accessToken);
    if (!nextUser) {
      throw new AuthError("The server returned an invalid session token. Please contact an administrator.");
    }

    setAccessToken(response.accessToken);
    window.localStorage.setItem(STORAGE_KEYS.accessToken, response.accessToken);
    setUser(nextUser);
    return nextUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      role: user?.role ?? null,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
