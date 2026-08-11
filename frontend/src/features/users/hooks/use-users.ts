"use client";

import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants";
import { userService } from "../services/user-service";
import type { UserListParams } from "../types";

export const usersQueryKeys = {
  all: ["users"] as const,
  list: (params: UserListParams) => [...usersQueryKeys.all, "list", params] as const,
};

export function useUsers(page: number, pageSize: number = DEFAULT_PAGE_SIZE) {
  const params: UserListParams = { page, pageSize };

  return useQuery({
    queryKey: usersQueryKeys.list(params),
    queryFn: () => userService.list(params),
  });
}
