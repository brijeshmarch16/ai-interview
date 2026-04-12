import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { Question } from "@/types/interview";
import type { Analytics, CallData } from "@/types/response";

export * from "./auth";

import { user } from "./auth";

export const candidateStatusEnum = pgEnum("candidate_status", [
  "NO_STATUS",
  "NOT_SELECTED",
  "POTENTIAL",
  "SELECTED",
]);

export type CandidateStatusValue = (typeof candidateStatusEnum.enumValues)[number];

// Derived from the DB enum — single source of truth, TypeScript will catch any drift
export const CandidateStatus = {
  NO_STATUS: "NO_STATUS",
  NOT_SELECTED: "NOT_SELECTED",
  POTENTIAL: "POTENTIAL",
  SELECTED: "SELECTED",
} as const satisfies Record<CandidateStatusValue, CandidateStatusValue>;

export const interviewer = pgTable("interviewer", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  agentId: text("agent_id"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  audio: text("audio"),
  empathy: integer("empathy").notNull(),
  exploration: integer("exploration").notNull(),
  rapport: integer("rapport").notNull(),
  speed: integer("speed").notNull(),
});

export const interview = pgTable("interview", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  name: text("name"),
  description: text("description"),
  objective: text("objective"),
  userId: text("user_id").references(() => user.id),
  interviewerId: uuid("interviewer_id").references(() => interviewer.id),
  isActive: boolean("is_active").default(true),
  readableSlug: text("readable_slug"),
  questions: jsonb("questions").$type<Question[]>(),
  respondents: text("respondents").array(),
  questionCount: integer("question_count"),
  responseCount: integer("response_count").default(0),
  timeDuration: text("time_duration"),
});

export const response = pgTable("response", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: uuid("interview_id").references(() => interview.id),
  name: text("name"),
  email: text("email"),
  callId: text("call_id"),
  candidateStatus: candidateStatusEnum("candidate_status"),
  duration: integer("duration"),
  details: jsonb("details").$type<CallData>(),
  analytics: jsonb("analytics").$type<Analytics>(),
  isAnalysed: boolean("is_analysed").default(false),
  isEnded: boolean("is_ended").default(false),
  isViewed: boolean("is_viewed").default(false),
  tabSwitchCount: integer("tab_switch_count"),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: uuid("interview_id").references(() => interview.id),
  email: text("email"),
  feedbackText: text("feedback"),
  satisfaction: integer("satisfaction"),
});
