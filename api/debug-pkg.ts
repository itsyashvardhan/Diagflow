import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as neonPkg from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        hasNeon: typeof neonPkg.neon === 'function',
        exports: Object.keys(neonPkg),
        nodeVersion: process.version,
    });
}
