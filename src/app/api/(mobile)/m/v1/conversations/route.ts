import { dbGetConversations } from '@/db/functions/chat';
import { NextRequest, NextResponse } from 'next/server';

import { getUserFromHeaders } from '../utils';

export async function GET(req: NextRequest) {
  try {
    const decryptedToken = getUserFromHeaders(req.headers);

    const conversations = await dbGetConversations({ userId: decryptedToken.id });
    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
