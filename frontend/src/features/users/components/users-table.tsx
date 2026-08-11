import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { UserRow } from "./user-row";
import type { UserListItem } from "../types";

interface UsersTableProps {
  users: readonly UserListItem[];
  isLoading: boolean;
  errorMessage: string | null;
}

const COLUMNS = ["User", "Role", "Status", "Last Login", "Actions"] as const;

function StateRow({ children }: { children: ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={COLUMNS.length} className="py-10 text-center text-on-surface-muted">
        {children}
      </TableCell>
    </TableRow>
  );
}

export function UsersTable({ users, isLoading, errorMessage }: UsersTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? [0, 1, 2].map((index) => (
                <TableRow key={index}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {!isLoading && errorMessage ? (
            <StateRow>
              <span className="font-semibold text-on-surface">Users could not be loaded.</span>
              <br />
              {errorMessage}
            </StateRow>
          ) : null}

          {!isLoading && !errorMessage && users.length === 0 ? (
            <StateRow>No users found.</StateRow>
          ) : null}

          {!isLoading && !errorMessage
            ? users.map((user) => <UserRow key={user.id} user={user} />)
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
