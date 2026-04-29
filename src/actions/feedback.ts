"use server"

import { getFeedbackByInterviewIdAndEmail } from "@/lib/data/feedback"
import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import type { FeedbackData } from "@/types/response"

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createFeedback = async (feedbackData: FeedbackData) => {
  const [created] = await db
    .insert(feedback)
    .values({
      interviewId: feedbackData.interview_id,
      satisfaction: feedbackData.satisfaction,
      feedbackText: feedbackData.feedback,
      email: feedbackData.email,
    })
    .returning()

  if (!created) {
    throw new Error("Failed to submit feedback")
  }

  return created
}

// ─── Re-exports from DAL (callable by client components as server actions) ────

export { getFeedbackByInterviewIdAndEmail }
