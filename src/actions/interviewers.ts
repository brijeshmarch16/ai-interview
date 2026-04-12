"use server";

import { and, eq } from "drizzle-orm";
import Retell from "retell-sdk";
import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { getInterviewer } from "@/lib/data/interviewers";
import { db } from "@/lib/db";
import { interviewer } from "@/lib/db/schema";

// ─── Re-exports from DAL (callable by client components as server actions) ────

export { getInterviewer as getInterviewerAction };

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createInterviewer = async (payload: typeof interviewer.$inferInsert) => {
  try {
    const existing = await db
      .select()
      .from(interviewer)
      .where(
        and(
          eq(interviewer.name, payload.name),
          payload.agentId != null ? eq(interviewer.agentId, payload.agentId) : undefined,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      console.error("An interviewer with this name already exists");
      return null;
    }

    const [created] = await db.insert(interviewer).values(payload).returning();
    return created ?? null;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    return null;
  }
};

export const createDefaultInterviewers = async () => {
  const retellClient = new Retell({
    apiKey: process.env.RETELL_API_KEY || "",
  });

  try {
    const newModel = await retellClient.llm.create({
      model: "gpt-4.1",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Chloe",
      agent_name: "Lisa",
    });

    const lisa = await createInterviewer({
      agentId: newFirstAgent.agent_id,
      ...INTERVIEWERS.LISA,
    });

    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Brian",
      agent_name: "Bob",
    });

    const bob = await createInterviewer({
      agentId: newSecondAgent.agent_id,
      ...INTERVIEWERS.BOB,
    });

    return { success: true, error: null, data: { lisa, bob } };
  } catch (error) {
    console.error("Error creating default interviewers:", error);
    return { success: false, error: "Failed to create interviewers", data: {} };
  }
};
