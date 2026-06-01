import { readDB, writeDB, getCurrentUser } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const user = getCurrentUser(db);
  const cart = db.cart?.[user.id] || {};
  return Response.json(cart);
}

export async function POST(request) {
  const db = readDB();
  const user = getCurrentUser(db);
  const { productId } = await request.json();

  if (!db.cart) db.cart = {};
  if (!db.cart[user.id]) db.cart[user.id] = {};

  if (db.cart[user.id][productId]) {
    db.cart[user.id][productId] += 1;
  } else {
    db.cart[user.id][productId] = 1;
  }

  writeDB(db);
  return Response.json({ success: true, cart: db.cart[user.id] });
}

export async function DELETE(request) {
  const db = readDB();
  const user = getCurrentUser(db);
  const { productId } = await request.json();

  if (db.cart?.[user.id]?.[productId]) {
    delete db.cart[user.id][productId];
  }

  writeDB(db);
  return Response.json({ success: true, cart: db.cart?.[user.id] || {} });
}
