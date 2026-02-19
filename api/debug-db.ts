import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSqlClient } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const info: any = {
        hasNeonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    };

    try {
        const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
        if (url) {
            const parsed = new URL(url);
            info.dbHost = parsed.host;
            info.dbPort = parsed.port;
            info.dbUser = parsed.username;
            info.dbName = parsed.pathname.substring(1);
        }

        const sql = getSqlClient();
        const result = await sql`SELECT 1 as connected`;

        info.queryResult = result;
        info.status = 'connected';

        // Test table access
        try {
            const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
            info.tables = tables;
        } catch (tableErr: any) {
            info.tableError = tableErr.message || String(tableErr);
        }

        res.status(200).json(info);
    } catch (error: any) {
        info.status = 'error';
        info.errorMessage = error.message || String(error);
        info.errorStack = error.stack;
        if (error.code) info.errorCode = error.code;

        console.error('[api/debug-db] Check failed', error);
        res.status(500).json(info);
    }
}
