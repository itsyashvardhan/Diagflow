import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSqlClient } from './_db';

const SHARE_ID_PATTERN = /^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/;
const MAX_CODE_LENGTH = 250_000;
const MAX_TITLE_LENGTH = 200;

type ApiError = { error: string };
type CreateShareLinkResponse = { id: string };
type SharedDiagramResponse = {
  id: string;
  code: string;
  title?: string;
  createdAt: string;
};

function sendError(res: VercelResponse, status: number, error: string): void {
  res.status(status).json({ error });
}

function parseBody<T>(req: VercelRequest): T {
  if (!req.body) {
    return {} as T;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as T;
  }
  return req.body as T;
}

function firstQueryValue(value: string | string[] | undefined): string | null {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] || null;
  }
  return value;
}

function normalizeTitle(input: unknown): string | null {
  if (typeof input !== 'string') {
    return null;
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.slice(0, MAX_TITLE_LENGTH);
}

function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segment = () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  return `${segment()}-${segment()}-${segment()}`;
}

async function handleCreate(req: VercelRequest, res: VercelResponse) {
  const body = parseBody<{ code?: unknown; title?: unknown }>(req);
  if (typeof body.code !== 'string' || !body.code.trim()) {
    sendError(res, 400, 'A non-empty diagram code string is required.');
    return;
  }
  if (body.code.length > MAX_CODE_LENGTH) {
    sendError(res, 413, 'Diagram code is too large.');
    return;
  }

  const sql = getSqlClient();
  const title = normalizeTitle(body.title);

  const existingResult = await sql`
    SELECT id
    FROM public.shared_diagrams
    WHERE code = ${body.code}
    LIMIT 1
  `;
  const existing = Array.isArray(existingResult) ? (existingResult as Array<{ id: string }>) : [];
  if (existing.length > 0) {
    res.status(200).json({ id: existing[0].id });
    return;
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const id = generateShareId();
    const insertedResult = await sql`
      INSERT INTO public.shared_diagrams (id, code, title)
      VALUES (${id}, ${body.code}, ${title})
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    const inserted = Array.isArray(insertedResult) ? (insertedResult as Array<{ id: string }>) : [];

    if (inserted.length > 0) {
      res.status(201).json({ id: inserted[0].id });
      return;
    }
  }

  sendError(res, 500, 'Failed to allocate a unique share ID. Please retry.');
}

async function handleRead(req: VercelRequest, res: VercelResponse) {
  const id = firstQueryValue(req.query.id);
  if (!id || !SHARE_ID_PATTERN.test(id)) {
    sendError(res, 400, 'A valid share ID is required.');
    return;
  }

  const sql = getSqlClient();
  const rowsResult = await sql`
    SELECT id, code, title, created_at
    FROM public.shared_diagrams
    WHERE id = ${id}
    LIMIT 1
  `;
  const rows = Array.isArray(rowsResult)
    ? (rowsResult as Array<{ id: string; code: string; title: string | null; created_at: string | Date }>)
    : [];

  if (rows.length === 0) {
    sendError(res, 404, 'Shared diagram not found.');
    return;
  }

  const row = rows[0];
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
  res.status(200).json({
    id: row.id,
    code: row.code,
    title: row.title || undefined,
    createdAt,
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    if (req.method === 'POST') {
      await handleCreate(req, res);
      return;
    }

    if (req.method === 'GET') {
      await handleRead(req, res);
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    sendError(res, 405, 'Method not allowed.');
  } catch (error) {
    console.error('[api/share-links] Request failed', error);
    if (error instanceof Error && /Missing database connection string/i.test(error.message)) {
      sendError(res, 503, 'Database connection is not configured. Set NEON_DATABASE_URL.');
      return;
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
      sendError(res, 503, 'Database table is not initialized. Please run db/schema.sql.');
      return;
    }
    if (error && typeof error === 'object' && 'code' in error && (error.code === '28P01' || error.code === '3D000')) {
      sendError(res, 503, 'Database credentials are invalid for the configured connection string.');
      return;
    }
    sendError(res, 500, 'Server error while handling share links.');
  }
}
