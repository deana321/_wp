import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const stats = {
    posts: db.posts?.length || 0,
    products: db.products?.length || 0,
    emails: db.emails?.length || 0,
    projects: db.projects?.length || 0,
  };
  return NextResponse.json(stats);
}
