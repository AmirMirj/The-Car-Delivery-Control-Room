import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is required. See starter/README.md.")

// prepare:false keeps us compatible with pooled hosted Postgres (Neon/Supabase pgbouncer) on Vercel.
const client = postgres(url, { max: 5, prepare: false })
export const db = drizzle(client, { schema })
