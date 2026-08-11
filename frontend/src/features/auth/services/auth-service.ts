import { httpClient } from "@/shared/api/http-client";
import { loginResponseSchema } from "../schemas/auth-response-schema";
import type { LoginRequest, LoginResponse } from "../types";

export const authService = {
  async login(input: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post("/auth/login", loginResponseSchema, input);
    return response.data;
  },
};
