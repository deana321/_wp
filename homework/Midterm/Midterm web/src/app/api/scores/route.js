import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const scores = (db.scores || [])
    .map(s => ({ id: s.id, playerName: s.playerName, score: s.score, createdAt: s.createdAt }))
    .sort((a, b) => b.score - a.score);
  return Response.json(scores);
}

export async function POST(request) {
  const body = await request.json();
  const { playerName, score } = body;

  if (!playerName || score === undefined || score === null) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const db = readDB();
  const newScore = {
    id: 's' + Date.now(),
    playerName,
    score: Number(score),
    createdAt: new Date().toISOString(),
  };

  db.scores = db.scores || [];
  db.scores.push(newScore);
  writeDB(db);

  return Response.json(newScore, { status: 201 });
}
