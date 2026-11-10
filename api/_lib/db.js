import { neon } from "@neondatabase/serverless";

let sql;
let schemaReady;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  if (!sql) sql = neon(connectionString);
  return sql;
}

export async function ensurePassesTable(database) {
  if (!schemaReady) {
    schemaReady = database`
      CREATE TABLE IF NOT EXISTS guest_passes (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
        email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
        phone TEXT NOT NULL CHECK (char_length(phone) BETWEEN 3 AND 40),
        pass_code TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        checked_in_at TIMESTAMPTZ
      )
    `.catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  await schemaReady;
}
