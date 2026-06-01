import { aiReplyDraft } from '@/lib/ai';

export async function POST(request) {
  const { content } = await request.json();

  if (!content) {
    return Response.json({ error: 'Missing content' }, { status: 400 });
  }

  const draft = aiReplyDraft(content);
  return Response.json({ draft });
}
