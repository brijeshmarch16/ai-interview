import { CheckCircleIcon } from "lucide-react"
import type React from "react"

const DEFAULT_ICON = (
  <CheckCircleIcon className="mx-auto my-4 h-8 w-8 text-primary" />
)

interface ScreenStatusCardProps {
  icon?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

export function ScreenStatusCard(props: ScreenStatusCardProps) {
  const { icon = DEFAULT_ICON, title, description, children } = props
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-md border border-primary/20 bg-muted">
        <div className="p-6">
          {icon}
          <p className="mb-2 text-center text-lg font-semibold">{title}</p>
          {description && (
            <p className="text-center text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      </div>
      <div className="flex items-center justify-center border-t border-border pt-6 text-center">
        <div className="text-center text-sm font-semibold">
          Powered by{" "}
          <span className="font-bold">
            AI <span className="text-primary">Interview</span>
          </span>
        </div>
      </div>
    </div>
  )
}
