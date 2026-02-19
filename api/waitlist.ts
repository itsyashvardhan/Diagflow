import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSqlClient } from './_db';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ApiError = { error: string };
type WaitlistResponse = { ok: true; inserted: boolean };

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

async function ensureWaitlistTable() {
  const sql = getSqlClient();
  await sql`
    CREATE TABLE IF NOT EXISTS public.waitlist (
      id bigserial PRIMARY KEY,
      email text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS waitlist_created_at_idx
    ON public.waitlist (created_at DESC)
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      sendError(res, 405, 'Method not allowed.');
      return;
    }

    const body = parseBody<{ email?: unknown }>(req);
    if (typeof body.email !== 'string') {
      sendError(res, 400, 'Email is required.');
      return;
    }

    const email = body.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      sendError(res, 400, 'A valid email address is required.');
      return;
    }

    await ensureWaitlistTable();

    const sql = getSqlClient();
    const insertedResult = await sql`
      INSERT INTO public.waitlist (email)
      VALUES (${email})
      ON CONFLICT (email) DO NOTHING
      RETURNING email
    `;
    const inserted = Array.isArray(insertedResult) ? (insertedResult as Array<{ email: string }>) : [];

    res.status(200).json({ ok: true, inserted: inserted.length > 0 });
  } catch (error) {
    console.error('[api/waitlist] Request failed', error);
    sendError(res, 500, 'Server error while handling waitlist.');
  }
}
