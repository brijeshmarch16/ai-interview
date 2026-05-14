import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

if (typeof window !== "undefined") {
  throw new Error("Database client cannot be used on the client side.")
}

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error("DATABASE_URL environment variable is not set.")
}

export const db = drizzle(new Pool({ connectionString: url }), {
  schema,
  casing: "snake_case",
})
