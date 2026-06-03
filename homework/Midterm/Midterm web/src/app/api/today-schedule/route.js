import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  const db = readDB();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];
  const dayNames = {
    Sunday: '星期日', Monday: '星期一', Tuesday: '星期二', Wednesday: '星期三',
    Thursday: '星期四', Friday: '星期五', Saturday: '星期六'
  };
  const courses = (db.courses || []).filter(c => c.day === today);
  return NextResponse.json({ day: today, dayName: dayNames[today], courses });
}
