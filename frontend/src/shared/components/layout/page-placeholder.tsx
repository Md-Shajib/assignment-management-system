import { Card } from "@/shared/components/ui/card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-h2 tracking-tight">{title}</h2>
        <p className="mt-1 max-w-xl text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <Card className="flex min-h-64 flex-col items-center justify-center text-center">
        <p className="text-body-sm text-on-surface-variant">This module is coming soon.</p>
      </Card>
    </div>
  );
}