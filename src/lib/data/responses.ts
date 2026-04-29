import "server-only"

import { and, avg, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { PAGE_SIZE } from "@/lib/constants"
import { db } from "@/lib/db"
import { response } from "@/lib/db/schema"
import type { CandidateStatusValue } from "@/lib/db/schema"
import { CandidateStatus } from "@/lib/db/schema"

export { PAGE_SIZE }

// ─── getResponsesPaginated ────────────────────────────────────────────────────
// Paginated list of completed responses for an interview, with optional name search and status filter.

export const getResponsesPaginated = async ({
  interviewId,
  page = 0,
  pageSize = PAGE_SIZE,
  search,
  status,
}: {
  interviewId: string
  page?: number
  pageSize?: number
  search?: string
  status?: string
}) => {
  const where = and(
    eq(response.interviewId, interviewId),
    eq(response.isEnded, true),
    search ? ilike(response.name, `%${search}%`) : undefined,
    status && status !== "ALL"
      ? status === "NO_STATUS"
        ? or(
            isNull(response.candidateStatus),
            eq(response.candidateStatus, "NO_STATUS")
          )
        : eq(response.candidateStatus, status as CandidateStatusValue)
      : undefined
  )
  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(response)
      .where(where)
      .orderBy(desc(response.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db.select({ count: count() }).from(response).where(where),
  ])
  return { data, total: Number(countResult[0]?.count ?? 0) }
}

// ─── getInterviewStats ────────────────────────────────────────────────────────
// Single-pass DB aggregation: completion rate, avg duration, sentiment counts, candidate status counts.

export const getInterviewStats = async (interviewId: string) => {
  const result = await db
    .select({
      totalCount: count(),
      avgDuration: avg(response.duration),
      completedCount: sql<number>`count(*) filter (
        where ${response.details}->'call_analysis'->>'agent_task_completion_rating'
        in ('Complete', 'Partial')
      )::int`,
      positive: sql<number>`count(*) filter (
        where ${response.details}->'call_analysis'->>'user_sentiment' = 'Positive'
      )::int`,
      negative: sql<number>`count(*) filter (
        where ${response.details}->'call_analysis'->>'user_sentiment' = 'Negative'
      )::int`,
      neutral: sql<number>`count(*) filter (
        where ${response.details}->'call_analysis'->>'user_sentiment' = 'Neutral'
      )::int`,
      noStatus: sql<number>`count(*) filter (
        where ${response.candidateStatus} is null
           or ${response.candidateStatus} = 'NO_STATUS'
      )::int`,
      notSelected: sql<number>`count(*) filter (
        where ${response.candidateStatus} = 'NOT_SELECTED'
      )::int`,
      potential: sql<number>`count(*) filter (
        where ${response.candidateStatus} = 'POTENTIAL'
      )::int`,
      selected: sql<number>`count(*) filter (
        where ${response.candidateStatus} = 'SELECTED'
      )::int`,
    })
    .from(response)
    .where(
      and(eq(response.interviewId, interviewId), eq(response.isEnded, true))
    )

  const row = result[0]
  const totalCount = Number(row?.totalCount ?? 0)
  const completedCount = Number(row?.completedCount ?? 0)

  return {
    totalCount,
    avgDuration: Number(row?.avgDuration ?? 0),
    completionRate: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    sentimentCount: {
      positive: row?.positive ?? 0,
      negative: row?.negative ?? 0,
      neutral: row?.neutral ?? 0,
    },
    candidateStatusCount: {
      [CandidateStatus.NO_STATUS]: row?.noStatus ?? 0,
      [CandidateStatus.NOT_SELECTED]: row?.notSelected ?? 0,
      [CandidateStatus.POTENTIAL]: row?.potential ?? 0,
      [CandidateStatus.SELECTED]: row?.selected ?? 0,
    },
  }
}

// ─── getResponseEmails ────────────────────────────────────────────────────────
// All candidate emails that have attempted this interview (used for duplicate-entry checks).

export const getResponseEmails = async (interviewId: string) => {
  try {
    const data = await db
      .select({ email: response.email })
      .from(response)
      .where(eq(response.interviewId, interviewId))

    return data || []
  } catch (error) {
    console.log(error)
    return []
  }
}

// ─── getResponseByCallId ──────────────────────────────────────────────────────
// Look up a response row by its Retell call_id (used in webhook and analysis flow).

export const getResponseByCallId = async (id: string) => {
  try {
    const data = await db.select().from(response).where(eq(response.callId, id))
    return data ? data[0] : null
  } catch (error) {
    console.log(error)
    return null
  }
}
