import { CheckCircleIcon } from "lucide-react";
import type React from "react";

const DEFAULT_ICON = <CheckCircleIcon className="mx-auto my-4 h-8 w-8 text-primary" />;

interface ScreenStatusCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function ScreenStatusCard(props: ScreenStatusCardProps) {
  const { icon = DEFAULT_ICON, title, description, children } = props;
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-md border border-primary/20 bg-muted">
        <div className="p-6">
          {icon}
          <p className="mb-2 text-center font-semibold text-lg">{title}</p>
          {description && <p className="text-center text-muted-foreground">{description}</p>}
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center border-border border-t pt-6 text-center">
        <div className="text-center font-semibold text-sm">
          Powered by{" "}
          <span className="font-bold">
            Open<span className="text-primary">Hire</span>
          </span>
        </div>
      </div>
    </div>
  );
}
