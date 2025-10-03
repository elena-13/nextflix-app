/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const SECRET = process.env.REVALIDATE_SECRET_TOKEN;

export const dynamic = 'force-dynamic'; // don't cache route

const NO_STORE = { 'Cache-Control': 'no-store' } as const;
const ALLOWED_PREFIXES = ['movie:', 'popular']; // allows tags

export async function POST(request: Request) {
  const token = request.headers.get('x-revalidate-token');
  if (!SECRET || token !== SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: NO_STORE });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400, headers: NO_STORE });
  }

  const tag = (
    typeof body === 'object' && body && (body as any).tag ? String((body as any).tag) : ''
  ).trim();
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400, headers: NO_STORE });
  }
  if (!ALLOWED_PREFIXES.some((p) => tag.startsWith(p))) {
    return NextResponse.json({ message: 'Tag not allowed' }, { status: 400, headers: NO_STORE });
  }

  revalidateTag(tag);

  return NextResponse.json(
    { revalidated: true, tag, at: new Date().toISOString() },
    { headers: NO_STORE }
  );
}
