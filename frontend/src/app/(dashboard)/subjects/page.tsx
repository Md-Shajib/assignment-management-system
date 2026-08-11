import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/components/layout/page-placeholder";

export const metadata: Metadata = {
  title: "Subjects",
};

export default function SubjectsPage() {
  return (
    <PagePlaceholder
      title="Subjects"
      description="Manage subjects and the teachers assigned to them."
    />
  );
}
