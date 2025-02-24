import { dbGetConversations } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  const conversations = await dbGetConversations({ userId: user.id });

  return NextResponse.json({ conversations });
}
