import { NextResponse } from 'next/server';
import { readDB, getCurrentUser, setCurrentUser } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const currentUser = getCurrentUser(db);
  const userCart = db.cart?.[currentUser.id] || {};
  const cartCount = Object.values(userCart).reduce((a, b) => a + b, 0);
  return NextResponse.json({ currentUser, users: db.users, cartCount });
}

export async function POST(request) {
  const db = readDB();
  const body = await request.json();
  const { userId } = body;
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  setCurrentUser(db, userId);
  const updatedDb = readDB();
  const newUser = getCurrentUser(updatedDb);
  const userCart = updatedDb.cart?.[newUser.id] || {};
  const cartCount = Object.values(userCart).reduce((a, b) => a + b, 0);
  return NextResponse.json({ currentUser: newUser, users: updatedDb.users, cartCount });
}
