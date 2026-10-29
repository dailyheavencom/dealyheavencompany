import type { Config, Context } from '@netlify/functions';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { demoState } from '../../db/schema.js';

const allowedKeys = new Set(['version', 'active_role', 'active_currency', 'products', 'orders', 'cart', 'wishlist', 'currencies', 'company_info', 'social_links', 'sellers', 'suppliers', 'payment_configs', 'reviews', 'support_tickets', 'audit_logs'].map(key => `dhco_${key === 'version' ? 'storage_version' : key}`));

export default async (request: Request, context: Context) => {
  const headers = { 'Cache-Control': 'no-store' };
  if (!['GET', 'PUT'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers });
  if (request.method === 'PUT' && request.headers.get('origin') !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403, headers });
  }
  let sessionId = context.cookies.get('dhco_demo');
  if (!sessionId || !/^[a-f0-9-]{36}$/.test(sessionId)) {
    sessionId = randomUUID();
    context.cookies.set({ name: 'dhco_demo', value: sessionId, httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'Strict', path: '/', maxAge: 60 * 60 * 24 * 30 });
  }
  try {
    if (request.method === 'GET') {
      const rows = await db.select().from(demoState).where(eq(demoState.sessionId, sessionId));
      return Response.json(Object.fromEntries(rows.map(row => [row.key, row.value])), { headers });
    }
    const body = await request.text();
    if (body.length > 1_000_000) return new Response('Session data too large', { status: 413, headers });
    let payload: unknown;
    try { payload = JSON.parse(body); } catch { return new Response('Invalid JSON', { status: 400, headers }); }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return new Response('Invalid data', { status: 400, headers });
    const entries = Object.entries(payload);
    if (entries.length > allowedKeys.size || entries.some(([key]) => !allowedKeys.has(key))) return new Response('Invalid data key', { status: 400, headers });
    await db.transaction(async tx => {
      for (const [key, value] of entries) {
        await tx.insert(demoState).values({ sessionId, key, value }).onConflictDoUpdate({
          target: [demoState.sessionId, demoState.key], set: { value, updatedAt: new Date() },
        });
      }
    });
    return Response.json({ saved: true }, { headers });
  } catch {
    return Response.json({ error: 'Unable to save or load your demo session. Please try again.' }, { status: 503, headers });
  }
};
export const config: Config = { path: '/api/demo-state' };
