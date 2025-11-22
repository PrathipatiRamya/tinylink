import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL env var is required");
}

// avoid creating many pools in dev HMR
if (!globalThis.__pgPool) {
  globalThis.__pgPool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
}

const pool = globalThis.__pgPool;
export default pool;
