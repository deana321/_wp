import { readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return Response.json(db.courses);
}
