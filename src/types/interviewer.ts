import type { interviewer } from "@/lib/db/schema"

// Derived from the Drizzle `interviewer` table so the type always matches the
// actual database columns (camelCase, with nullable `createdAt`/`agentId`/`audio`).
export type Interviewer = typeof interviewer.$inferSelect
