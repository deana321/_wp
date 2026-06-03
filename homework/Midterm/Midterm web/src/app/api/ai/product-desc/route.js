import { aiProductDescription } from '@/lib/ai';

export async function POST(request) {
  const { name } = await request.json();
  const description = aiProductDescription(name);
  return Response.json({ description });
}
