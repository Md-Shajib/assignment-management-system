import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui/card";

interface ErrorStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <Card className="mx-auto flex w-full max-w-md flex-col items-center gap-3 p-8 text-center">
      <h2 className="text-h3">{title}</h2>
      <p className="text-body-sm text-on-surface-variant">{description}</p>
      {action}
    </Card>
  );
}
