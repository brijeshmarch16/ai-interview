import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { interviewer } from "@/lib/db/schema"

// ─── getAllInterviewers ───────────────────────────────────────────────────────
// Fetch all available AI interviewers (used in interview creation and detail pages).

export const getAllInterviewers = async () => {
  try {
    const data = await db.select().from(interviewer)
    return data || []
  } catch (error) {
    console.log(error)
    return []
  }
}

// ─── getInterviewer ───────────────────────────────────────────────────────────
// Fetch a single interviewer by ID (used to resolve agentId before starting a Retell call).

export const getInterviewer = async (interviewerId: string) => {
  try {
    const [data] = await db
      .select()
      .from(interviewer)
      .where(eq(interviewer.id, interviewerId))
      .limit(1)

    return data ?? null
  } catch (error) {
    console.error("Error fetching interviewer:", error)
    return null
  }
}
