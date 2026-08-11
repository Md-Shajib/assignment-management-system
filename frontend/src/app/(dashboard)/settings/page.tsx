import type { Metadata } from "next";
import { PagePlaceholder } from "@/shared/components/layout/page-placeholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PagePlaceholder title="Settings" description="Configure workspace and account preferences." />
  );
}
