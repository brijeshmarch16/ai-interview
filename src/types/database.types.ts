import type { InferSelectModel } from "drizzle-orm";
import type { interview, response } from "@/lib/db/schema";

export type InterviewRow = InferSelectModel<typeof interview>;
export type ResponseRow = InferSelectModel<typeof response>;

export type Interview = InterviewRow;
export type InterviewDetailTableResponse = ResponseRow;
