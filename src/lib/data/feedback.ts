import "server-only"

import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import type { FeedbackData } from "@/types/response"

// ─── getFeedbackByInterviewIdAndEmail ─────────────────────────────────────────
// Fetch a candidate's feedback submission for a given interview and email.

export const getFeedbackByInterviewIdAndEmail = async (
  interviewId: string,
  email: string
): Promise<FeedbackData | null> => {
  const [row] = await db
    .select()
    .from(feedback)
    .where(
      and(eq(feedback.interviewId, interviewId), eq(feedback.email, email))
    )
    .limit(1)

  if (!row) return null

  return {
    interview_id: row.interviewId ?? "",
    satisfaction: row.satisfaction,
    feedback: row.feedbackText,
    email: row.email,
  }
}
