"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { convertSecondstoMMSS, formatTimestampToDateHHMM } from "@/lib/utils"
import type { InterviewDetailTableResponse } from "@/types/database.types"
import CandidateStatusDropdown from "../candidate-response/candidate-status-dropdown"

interface UseInterviewDetailColumnsParams {
  analyzingCallId: string | null
  handleViewResponse: (response: InterviewDetailTableResponse) => void
  handleAnalyzeResponse: (response: InterviewDetailTableResponse) => void
}

export function useInterviewDetailColumns({
  analyzingCallId,
  handleViewResponse,
  handleAnalyzeResponse,
}: UseInterviewDetailColumnsParams): ColumnDef<InterviewDetailTableResponse>[] {
  return useMemo<ColumnDef<InterviewDetailTableResponse>[]>(() => {
    return [
      {
        header: "Name",
        accessorKey: "name",
        size: 150,
      },
      {
        header: "Email",
        accessorKey: "email",
        size: 200,
      },
      {
        header: "Overall Score",
        accessorKey: "analytics.overallScore",
        cell: ({ row }) => {
          const score = row.original.analytics?.overallScore
          return score != null ? (
            <Badge className="size-7 bg-primary/20 text-primary">{score}</Badge>
          ) : (
            "—"
          )
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Communication",
        accessorKey: "analytics.communication.score",
        cell: ({ row }) => {
          const score = row.original.analytics?.communication?.score
          return score != null ? (
            <Badge className="size-7 bg-muted-foreground/30 text-foreground">
              {score}
            </Badge>
          ) : (
            "—"
          )
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          formatTimestampToDateHHMM(String(row.original.createdAt)),
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Duration",
        accessorKey: "duration",
        cell: ({ row }) => convertSecondstoMMSS(row.original.duration ?? 0),
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Tab Switches",
        accessorKey: "tabSwitchCount",
        cell: ({ row }) => {
          const count = row.original.tabSwitchCount
          if (!count || count === 0) return "—"
          return (
            <Badge
              variant="outline"
              className="rounded-md border-orange-300 bg-orange-50 text-orange-600"
            >
              {count}
            </Badge>
          )
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Status",
        accessorKey: "candidateStatus",
        size: 200,
        cell: ({ row }) => (
          <CandidateStatusDropdown
            call_id={row.original.callId ?? ""}
            initialStatus={row.original.candidateStatus ?? ""}
          />
        ),
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        id: "actions",
        header: "Details",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              size="xs"
              variant="outline"
              className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => handleViewResponse(row.original)}
            >
              View
            </Button>
            {!row.original.isAnalysed && (
              <Button
                size="xs"
                variant="outline"
                className="border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => handleAnalyzeResponse(row.original)}
                disabled={analyzingCallId === row.original.callId}
              >
                {analyzingCallId === row.original.callId
                  ? "Analyzing..."
                  : "Analyze"}
              </Button>
            )}
          </div>
        ),
        meta: {
          headerAlign: "center",
        },
      },
    ]
  }, [analyzingCallId, handleViewResponse, handleAnalyzeResponse])
}
