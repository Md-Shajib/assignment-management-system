import type { Metadata } from "next";
import { SubmitAssignment } from "@/features/submissions/components/submit-assignment";

export const metadata: Metadata = {
  title: "Submit Assignment",
};

export default async function SubmitAssignmentPage({
  params,
}: PageProps<"/assignments/[id]/submit">) {
  const { id } = await params;
  return <SubmitAssignment assignmentId={id} />;
}
