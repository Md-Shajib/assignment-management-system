"use client";

import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Pagination } from "@/shared/components/ui/pagination";
import { DEFAULT_PAGE_SIZE } from "@/shared/constants";
import type { ApiMeta } from "@/shared/types/api";
import { useUsers } from "../hooks/use-users";
import { UsersTable } from "./users-table";
import { UsersToolbar } from "./users-toolbar";

export function UsersList() {
  const [page, setPage] = useState(1);
  const { data, isPending, error } = useUsers(page);

  const users = data?.data ?? [];
  const meta: ApiMeta = data?.meta ?? {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    totalRecords: users.length,
    totalPages: users.length > 0 ? 1 : 0,
  };

  return (
    <Card className="mt-6 overflow-hidden">
      <UsersToolbar />
      <UsersTable users={users} isLoading={isPending} errorMessage={error ? error.message : null} />
      <div className="border-t border-border-muted">
        <Pagination meta={meta} onPageChange={setPage} />
      </div>
    </Card>
  );
}
