import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '10 s') });

export async function middleware(req) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'anonymous';
  const { limit, reset, remaining } = await ratelimit.limit(ip);
  if (!remaining) return new Response('Too many requests', { status: 429 });
  return NextResponse.next();
} 