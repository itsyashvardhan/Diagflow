import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const info: any = {
        step: 'init',
        node: process.version,
    };

    try {
        const rawUrl = (
            process.env.NEON_DATABASE_URL ||
            process.env.POSTGRES_URL ||
            process.env.DATABASE_URL ||
            ''
        ).trim();

        info.hasUrl = !!rawUrl;
        if (!rawUrl) throw new Error('No URL');

        info.step = 'parsing_url';
        let url = rawUrl;
        if (url.includes('-pooler.')) {
            url = url.replace('-pooler.', '.');
        }

        // Strip complex params that might break HTTP proxy
        const urlObj = new URL(url);
        urlObj.searchParams.delete('channel_binding');
        const cleanUrl = urlObj.toString();

        info.cleanUrlHost = urlObj.host;
        info.step = 'creating_client';
        const sql = neon(cleanUrl);

        info.step = 'executing_query';
        const result = await sql`SELECT 1 as connected`;

        info.result = result;
        info.status = 'success';
        res.status(200).json(info);
    } catch (err: any) {
        res.status(500).json({
            status: 'error',
            step: info.step,
            message: err.message,
            stack: err.stack
        });
    }
}
