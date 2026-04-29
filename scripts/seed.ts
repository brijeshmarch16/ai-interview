import { createDefaultInterviewers } from "@/actions/interviewers"
import { db } from "@/lib/db"
import { interviewer } from "@/lib/db/schema"

async function main() {
  const existing = await db.select().from(interviewer)
  if (existing.length > 0) {
    console.log("Interviewers already seeded. Skipping.")
    return
  }
  await createDefaultInterviewers()
  console.log("Seeded Lisa & Bob successfully.")
}

main().catch(console.error)
