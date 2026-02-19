import { neon } from '@neondatabase/serverless';

type SqlClient = ReturnType<typeof neon>;

declare global {
  var __diagfloSqlClient: SqlClient | undefined;
}

function getDatabaseUrl(): string {
  const url = (
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ''
  ).trim();

  if (!url) {
    throw new Error('Missing database connection string. Set NEON_DATABASE_URL, POSTGRES_URL or DATABASE_URL.');
  }

  // Log (masked) for debugging purposes in serverless logs
  try {
    const parsed = new URL(url);
    console.log(`[db] Target host: ${parsed.host}`);
  } catch {
    console.error('[db] Failed to parse database URL');
  }

  return url;
}

export function getSqlClient(): SqlClient {
  if (!global.__diagfloSqlClient) {
    let url = getDatabaseUrl();

    // the 'neon()' driver from @neondatabase/serverless uses HTTP.
    // The HTTP proxy is already pooled. Using the Neondb Connection Pooler host (-pooler)
    // can sometimes cause issues with HTTP routing or certificate validation in some environments.
    // We'll use the direct host if it's a pooled hostname.
    if (url.includes('-pooler.')) {
      url = url.replace('-pooler.', '.');
    }

    global.__diagfloSqlClient = neon(url);
  }
  return global.__diagfloSqlClient;
}
