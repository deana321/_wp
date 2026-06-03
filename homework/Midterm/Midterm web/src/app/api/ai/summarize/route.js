import { aiSummarize } from '@/lib/ai';

export async function POST(request) {
  const { content } = await request.json();

  if (!content) {
    return Response.json({ error: 'Missing content' }, { status: 400 });
  }

  const summary = aiSummarize(content);
  return Response.json({ summary });
}
