import { dbGetConversations, dbSearchConversationsByName } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (q && q.length > 0) {
      const conversations = await dbSearchConversationsByName({ q, userId: user.id });
      return NextResponse.json({ conversations }, { status: 200 });
    }

    const conversations = await dbGetConversations({ userId: user.id, limit: 15 });
    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
