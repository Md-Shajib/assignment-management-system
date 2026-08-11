import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/components/layout/page-placeholder";

export const metadata: Metadata = {
  title: "Classes",
};

export default function ClassesPage() {
  return (
    <PagePlaceholder
      title="Classes"
      description="Manage classes and the students enrolled in them."
    />
  );
}
