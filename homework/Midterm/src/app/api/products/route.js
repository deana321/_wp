import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  return Response.json(db.products || []);
}

export async function POST(request) {
  const db = readDB();
  const body = await request.json();
  const products = db.products || [];

  const maxId = products.reduce((max, p) => {
    const num = parseInt(p.id.replace('prod', ''), 10);
    return num > max ? num : max;
  }, 0);

  const newProduct = {
    id: `prod${maxId + 1}`,
    name: body.name,
    price: Number(body.price),
    emoji: body.emoji || '📦',
    description: body.description || '',
    category: body.category || '其他',
  };

  products.push(newProduct);
  db.products = products;
  writeDB(db);

  return Response.json({ success: true, product: newProduct });
}
