import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CreateAssignmentForm } from "@/features/assignments/components/create-assignment-form";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = {
  title: "Create Assignment",
};

export default function CreateAssignmentPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-body-sm">
          <li className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4 text-on-surface-muted" aria-hidden />
            <Link href={ROUTES.assignments} className="text-on-surface-muted hover:text-on-surface">
              Assignments
            </Link>
          </li>
          <ChevronRight className="h-4 w-4 shrink-0 text-on-surface-subtle" aria-hidden />
          <li aria-current="page" className="font-semibold text-primary">
            Create New
          </li>
        </ol>
      </nav>

      <h1 className="mt-3 text-h1">Create Assignment</h1>
      <p className="mt-1 text-body-sm text-on-surface-muted">
        Design and distribute a new task for your students.
      </p>

      <div className="mt-6">
        <CreateAssignmentForm />
      </div>
    </div>
  );
}
