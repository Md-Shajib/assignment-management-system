import { httpClient } from "@/shared/api/http-client";
import type { ApiResponse } from "@/shared/types/api";
import { userListSchema } from "../schemas/user-schema";
import type { UserListItem, UserListParams } from "../types";

export const userService = {
  /** `GET /users?page&pageSize` (docs/04-API-DESIGN.md §8.2, Admin only). */
  list({ page, pageSize }: UserListParams): Promise<ApiResponse<UserListItem[]>> {
    return httpClient.get("/users", userListSchema, { params: { page, pageSize } });
  },
};
