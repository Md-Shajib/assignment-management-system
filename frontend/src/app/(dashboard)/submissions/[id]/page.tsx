import type { Metadata } from "next";
import { SubmissionReview } from "@/features/submissions/components/submission-review";

export const metadata: Metadata = {
  title: "Review Submission",
};

export default async function ReviewSubmissionPage({ params }: PageProps<"/submissions/[id]">) {
  const { id } = await params;
  return <SubmissionReview submissionId={id} />;
}
