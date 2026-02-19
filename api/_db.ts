import { neon } from '@neondatabase/serverless';

function getDatabaseUrl(): string {
  const url = (
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ''
  ).trim();

  if (!url) {
    throw new Error('Missing database connection string.');
  }
  return url;
}

export function getSqlClient() {
  let url = getDatabaseUrl();
  // Ensure we use the non-pooling endpoint for the HTTP-based 'neon()' driver
  if (url.includes('-pooler.')) {
    url = url.replace('-pooler.', '.');
  }
  return neon(url);
}
