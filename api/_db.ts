import { neon } from '@neondatabase/serverless';

type SqlClient = ReturnType<typeof neon>;

declare global {
  var __diagfloSqlClient: SqlClient | undefined;
}

function getDatabaseUrl(): string {
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Missing database connection string. Set NEON_DATABASE_URL or DATABASE_URL.');
  }
  return url;
}

export function getSqlClient(): SqlClient {
  if (!global.__diagfloSqlClient) {
    global.__diagfloSqlClient = neon(getDatabaseUrl());
  }
  return global.__diagfloSqlClient;
}
