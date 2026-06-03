import { readDB, writeDB, getCurrentUser } from '@/lib/db';

export async function POST() {
  const db = readDB();
  const user = getCurrentUser(db);
  if (db.cart) db.cart[user.id] = {};
  writeDB(db);
  return Response.json({ success: true, message: '結帳成功！感謝您的購買 🎉' });
}
