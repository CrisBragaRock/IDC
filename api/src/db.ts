import { Pool, QueryResultRow } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const db = {
  query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => pool.query<T>(text, params),
};
