import { Card } from "@/shared/components/ui/card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h1">{title}</h1>
        <p className="mt-1 max-w-xl text-body-sm text-on-surface-muted">{description}</p>
      </div>
      <Card className="flex min-h-64 flex-col items-center justify-center text-center">
        <p className="text-body-sm text-on-surface-muted">This module is coming soon.</p>
      </Card>
    </div>
  );
}
