import type React from "react";

interface Props {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

export default function StatusCard({ value, label, icon }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="font-bold text-2xl">{value}</span>
        <div className="rounded-xl bg-primary/10 p-2">{icon}</div>
      </div>
      <p className="font-medium text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
