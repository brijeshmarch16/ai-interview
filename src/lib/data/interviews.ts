import "server-only"

import { desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { interview, interviewer, response } from "@/lib/db/schema"
import type { Interview } from "@/types/database.types"
import type { Question } from "@/types/interview"

// ─── Types ────────────────────────────────────────────────────────────────────

type InterviewWithDetails = {
  id: string
  name: string | null
  readableSlug: string | null
  interviewerImage: string | null
  responseCount: number | null
  isActive: boolean | null
}

// ─── getInterviewsWithDetails ─────────────────────────────────────────────────
// List all interviews for a user with their interviewer image and completed response count.

export const getInterviewsWithDetails = async (
  userId: string
): Promise<InterviewWithDetails[]> => {
  try {
    const responseCountSubquery = db
      .select({
        interviewId: response.interviewId,
        count: sql<number>`count(${response.id})::int`.as("count"),
      })
      .from(response)
      .where(eq(response.isEnded, true))
      .groupBy(response.interviewId)
      .as("rcs")

    const data = await db
      .select({
        id: interview.id,
        name: interview.name,
        readableSlug: interview.readableSlug,
        interviewerImage: interviewer.image,
        responseCount: responseCountSubquery.count,
        isActive: interview.isActive,
      })
      .from(interview)
      .leftJoin(interviewer, eq(interview.interviewerId, interviewer.id))
      .leftJoin(
        responseCountSubquery,
        eq(interview.id, responseCountSubquery.interviewId)
      )
      .where(eq(interview.userId, userId))
      .orderBy(desc(interview.createdAt))

    return data ?? []
  } catch (error) {
    console.log(error)
    return []
  }
}

// ─── getInterviewById ─────────────────────────────────────────────────────────
// Fetch a single interview by ID, with questions cast to the typed Question[].

export const getInterviewById = async (
  id: string
): Promise<Interview | null> => {
  try {
    const data = await db.select().from(interview).where(eq(interview.id, id))
    const row = data[0]
    if (!row) return null
    return {
      ...row,
      questions: row.questions as Question[] | null,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
