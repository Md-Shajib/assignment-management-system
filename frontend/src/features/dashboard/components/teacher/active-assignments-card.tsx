"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { AssignmentStatus } from "@/features/assignments/types";
import { Badge, type BadgeProps } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ROUTES } from "@/shared/constants";
import { cn } from "@/shared/utils/cn";
import { useTeacherAssignments } from "../../hooks/use-teacher-assignments";
import type { AssignmentRow } from "../../types";

const COLUMNS = ["Title", "Class", "Due Date", "Status"] as const;
const VISIBLE_ROWS = 5;

const STATUS_VARIANTS: Record<AssignmentStatus, BadgeProps["variant"]> = {
  Draft: "default",
  Published: "primary",
  Closed: "outline",
};

function StateRow({ children }: { children: ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={COLUMNS.length} className="py-10 text-center text-on-surface-muted">
        {children}
      </TableCell>
    </TableRow>
  );
}

function AssignmentTableRow({ row }: { row: AssignmentRow }) {
  return (
    <TableRow>
      <TableCell>
        <p className="font-semibold text-on-surface">{row.title}</p>
        {row.courseCode ? (
          <p className="text-caption text-on-surface-muted">{row.courseCode}</p>
        ) : null}
      </TableCell>

      <TableCell className="text-on-surface-variant">{row.courseName}</TableCell>

      <TableCell className={cn(row.isDueSoon ? "font-semibold text-danger" : "text-on-surface-variant")}>
        {row.dueLabel}
      </TableCell>

      <TableCell>
        <Badge variant={STATUS_VARIANTS[row.status]}>{row.status}</Badge>
      </TableCell>
    </TableRow>
  );
}

export function ActiveAssignmentsCard({ className }: { className?: string }) {
  const { activeRows, isLoading, errorMessage } = useTeacherAssignments();
  const visibleRows = activeRows.slice(0, VISIBLE_ROWS);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-4 p-6 pb-4">
        <h2 className="text-h3 tracking-tight">My Active Assignments</h2>
        <Link
          href={ROUTES.assignments}
          className="rounded-sm text-label text-primary transition-colors hover:text-primary-container"
        >
          View All
        </Link>
      </div>

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
              ? [0, 1, 2, 3].map((index) => (
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
                <span className="font-semibold text-on-surface">Assignments could not be loaded.</span>
                <br />
                {errorMessage}
              </StateRow>
            ) : null}

            {!isLoading && !errorMessage && visibleRows.length === 0 ? (
              <StateRow>You have no active assignments.</StateRow>
            ) : null}

            {!isLoading && !errorMessage
              ? visibleRows.map((row) => <AssignmentTableRow key={row.id} row={row} />)
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
