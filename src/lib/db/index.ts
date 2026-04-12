import * as schema from "./schema";

if (typeof window !== "undefined") {
  throw new Error("Database client cannot be used on the client side.");
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL environment variable is not set.");
}
const isNeon = url.includes("neon.tech");

// Neon (production / serverless) — uses HTTP transport, no persistent TCP connections
// Local Postgres (development via Docker) — uses node-postgres TCP pool
// Detection is automatic: if DATABASE_URL contains "neon.tech" → Neon driver, otherwise → pg pool

function createNeonDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/neon-http");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { neon } = require("@neondatabase/serverless");
  return drizzle(neon(url), { schema, casing: "snake_case" });
}

function createLocalDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle } = require("drizzle-orm/node-postgres");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg");
  return drizzle(new Pool({ connectionString: url }), { schema, casing: "snake_case" });
}

export const db = isNeon ? createNeonDb() : createLocalDb();
