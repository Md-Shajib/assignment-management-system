import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { UsersList } from "@/features/users/components/users-list";
import { Button } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "User Management",
};

export default function UsersPage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1">User Management</h1>
          <p className="mt-1 text-body-sm text-on-surface-muted">
            Manage system users, roles, and access permissions.
          </p>
        </div>

        {/* `POST /users` is not implemented yet; accounts are created via the API only. */}
        <Button disabled title="Creating users is not available yet">
          <Plus className="h-4 w-4" aria-hidden />
          Create New User
        </Button>
      </div>

      <UsersList />
    </div>
  );
}
