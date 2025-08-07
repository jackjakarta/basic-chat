import { dbGetConversations } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();

  try {
    const conversations = await dbGetConversations({ userId: user.id });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
