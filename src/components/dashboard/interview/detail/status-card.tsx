import type React from "react"

interface Props {
  value: string | number
  label: string
  icon: React.ReactNode
}

export default function StatusCard({ value, label, icon }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <div className="rounded-xl bg-primary/10 p-2">{icon}</div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
