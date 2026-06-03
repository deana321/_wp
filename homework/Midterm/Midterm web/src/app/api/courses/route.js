import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return Response.json(db.courses);
}

export async function POST(request) {
  const db = readDB();
  const body = await request.json();
  const newId = 'crs' + (db.courses.length + 1);
  const course = { id: newId, ...body };
  db.courses.push(course);
  writeDB(db);
  return Response.json(course, { status: 201 });
}
