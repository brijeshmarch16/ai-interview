"use client"

import { AlarmClockMinusIcon, XCircleIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Interview } from "@/types/database.types"
import BrandingFooter from "./branding-footer"
import ConfirmDialog from "./confirm-dialog"

interface ActiveCallScreenProps {
  interview: Interview
  isLoading: boolean
  interviewerImg: string
  lastInterviewerResponse: string
  lastUserResponse: string
  activeTurn: "agent" | "user" | ""
  progressPercent: number
  remainingSeconds: number
  userName: string
  onEndInterview: () => void
}

export default function ActiveCallScreen(props: ActiveCallScreenProps) {
  const {
    interview,
    isLoading,
    interviewerImg,
    lastInterviewerResponse,
    lastUserResponse,
    activeTurn,
    progressPercent,
    remainingSeconds,
    userName,
    onEndInterview,
  } = props

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
  const lastUserResponseRef = useRef<HTMLDivElement | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom on new response
  useEffect(() => {
    if (lastUserResponseRef.current) {
      const { current } = lastUserResponseRef
      current.scrollTop = current.scrollHeight
    }
  }, [lastUserResponse])

  return (
    <div className="w-full max-w-6xl py-8">
      <Card className="w-full overflow-hidden rounded-md border-2 border-r-4 border-b-4 border-border bg-card py-0">
        {/* Card header */}
        <div className="border-b border-border p-6">
          {/* Row 1: Title + End Interview button */}
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold md:text-2xl">{interview?.name}</h2>
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-destructive/40 bg-destructive/10 hover:border-destructive hover:bg-destructive/10"
                  disabled={isLoading}
                >
                  End Interview
                  <XCircleIcon className="h-4 w-4 text-destructive" />
                </Button>
              }
              title="Are you sure?"
              description="This action cannot be undone. This action will end the call."
              onConfirm={onEndInterview}
            />
          </div>

          {/* Row 2: Meta badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
              <AlarmClockMinusIcon className="h-3.5 w-3.5 text-primary" />
              <span>
                Remaining:{" "}
                <span className="font-bold">
                  {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:
                  {String(remainingSeconds % 60).padStart(2, "0")}
                </span>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-primary/20">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Two-column grid body */}
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {/* Left panel — Interviewer */}
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-5">
            <Image
              src={interviewerImg}
              alt="Image of the interviewer"
              width={80}
              height={80}
              className={`rounded-full border-2 object-cover object-center transition-all ${activeTurn === "agent" ? "border-primary" : "border"}`}
            />
            <span className="text-sm font-semibold">Interviewer</span>
            <div className="scrollbar-thin h-45 w-full overflow-y-auto text-sm leading-relaxed md:text-base">
              {lastInterviewerResponse || (
                <span className="text-muted-foreground italic">
                  Waiting for interviewer...
                </span>
              )}
            </div>
          </div>

          {/* Right panel — User */}
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-5">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 bg-primary/10 transition-all ${activeTurn === "user" ? "border-primary" : "border"}`}
            >
              <span className="text-2xl font-semibold text-primary">
                {initials}
              </span>
            </div>
            <span className="text-sm font-semibold">You</span>
            <div
              ref={lastUserResponseRef}
              className="scrollbar-thin wrap-break-words h-45 w-full overflow-x-hidden overflow-y-auto text-sm leading-relaxed md:text-base"
            >
              {lastUserResponse || (
                <span className="text-muted-foreground italic">
                  Your response will appear here...
                </span>
              )}
            </div>
          </div>
        </div>

        <BrandingFooter />
      </Card>
    </div>
  )
}
