"use server";

import { eq } from "drizzle-orm";
import { getResponseByCallId, getResponseEmails } from "@/lib/data/responses";
import { db } from "@/lib/db";
import { response } from "@/lib/db/schema";

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createResponse = async (payload: typeof response.$inferInsert) => {
  try {
    const [created] = await db.insert(response).values(payload).returning({ id: response.id });
    return created?.id ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateResponse = async (
  payload: Partial<typeof response.$inferInsert>,
  call_id: string,
) => {
  try {
    const updated = await db
      .update(response)
      .set(payload)
      .where(eq(response.callId, call_id))
      .returning();
    return updated;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteResponse = async (id: string) => {
  try {
    const deleted = await db.delete(response).where(eq(response.callId, id)).returning();
    return deleted;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// ─── Re-exports from DAL (callable by client components as server actions) ────

export {
  getResponseByCallId as getResponseByCallIdAction,
  getResponseEmails as getResponseEmailsAction,
};
