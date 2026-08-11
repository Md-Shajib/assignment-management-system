import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/components/layout/page-placeholder";

export const metadata: Metadata = {
  title: "Assignments",
};

export default function AssignmentsPage() {
  return (
    <PagePlaceholder
      title="Assignments"
      description="Create, publish, and manage assignments for your subjects."
    />
  );
}
