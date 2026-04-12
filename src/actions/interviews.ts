"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { feedback, interview, response } from "@/lib/db/schema";

type CreateInterviewPayload = Pick<
  typeof interview.$inferInsert,
  | "name"
  | "description"
  | "objective"
  | "interviewerId"
  | "questions"
  | "questionCount"
  | "timeDuration"
> & { interviewerId: string };

type UpdateInterviewPayload = Partial<
  Pick<
    typeof interview.$inferInsert,
    | "name"
    | "objective"
    | "description"
    | "questions"
    | "interviewerId"
    | "questionCount"
    | "timeDuration"
    | "isActive"
  >
>;

export const createInterview = async (payload: CreateInterviewPayload) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) {
      return { success: false, error: "Unauthorized", data: {} };
    }

    await db.insert(interview).values({
      name: payload.name,
      description: payload.description,
      objective: payload.objective,
      userId: userId,
      interviewerId: payload.interviewerId ?? null,
      questions: payload.questions,
      questionCount: payload.questionCount,
      timeDuration: payload.timeDuration,
    });

    revalidatePath("/");
    return { success: true, error: null, data: {} };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false, error: "Failed to create interview", data: {} };
  }
};

export const updateInterview = async (id: string, payload: UpdateInterviewPayload) => {
  try {
    const [updated] = await db
      .update(interview)
      .set(payload)
      .where(eq(interview.id, id))
      .returning();
    revalidatePath("/");
    return { success: true, error: null, data: updated ?? null };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { success: false, error: "Failed to update interview", data: {} };
  }
};

export const deleteInterview = async (id: string) => {
  try {
    await db.delete(response).where(eq(response.interviewId, id));
    await db.delete(feedback).where(eq(feedback.interviewId, id));
    await db.delete(interview).where(eq(interview.id, id));
    revalidatePath("/");
    return { success: true, error: null, data: {} };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { success: false, error: "Failed to delete interview", data: {} };
  }
};
