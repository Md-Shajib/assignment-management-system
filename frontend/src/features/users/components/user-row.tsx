import { MoreHorizontal } from "lucide-react";
import type { UserRole } from "@/features/auth/types";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { formatDate } from "@/shared/utils/date";
import type { UserListItem } from "../types";

const roleVariant: Record<UserRole, "admin" | "teacher" | "student"> = {
  Admin: "admin",
  Teacher: "teacher",
  Student: "student",
};

export function UserRow({ user }: { user: UserListItem }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-on-surface">{user.fullName}</p>
            <p className="truncate text-caption text-on-surface-muted">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
      </TableCell>

      <TableCell>
        {user.isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="default">Inactive</Badge>
        )}
      </TableCell>

      {/* The schema has no last-login column yet, so this reads "Never" for now. */}
      <TableCell className="text-on-surface-muted">
        {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
      </TableCell>

      <TableCell>
        <button
          type="button"
          disabled
          title="User actions are not available yet"
          aria-label={`Actions for ${user.fullName}`}
          className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-muted transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        </button>
      </TableCell>
    </TableRow>
  );
}
