import type { ReactNode } from "react";

interface CircularProgressProps {
  value?: number;
  maxValue?: number;
  minValue?: number;
  showValueLabel?: boolean;
  valueLabel?: ReactNode;
  classNames?: Record<string, string>;
}

export function CircularProgress(props: CircularProgressProps) {
  const { value = 0, maxValue = 100, minValue = 0, showValueLabel, valueLabel } = props;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = ((value - minValue) / (maxValue - minValue)) * 100;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative flex h-28 w-28 items-center justify-center text-primary">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" fill="none">
        <title>Progress Circle</title>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="opacity-10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {showValueLabel && (
        <span className="absolute font-semibold text-3xl text-primary">
          {valueLabel ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}
