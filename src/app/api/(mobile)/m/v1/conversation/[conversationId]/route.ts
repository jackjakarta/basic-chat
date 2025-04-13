import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { NextRequest, NextResponse } from 'next/server';

import { getUserFromHeaders } from '../../utils';

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
  const { conversationId } = params;

  try {
    const decryptedToken = getUserFromHeaders(req.headers);

    const conversation = await dbGetConversationById({
      userId: decryptedToken.id,
      conversationId,
    });

    if (conversation === undefined) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 },
      );
    }

    const conversationMessages = await dbGetCoversationMessages({
      userId: decryptedToken.id,
      conversationId,
    });

    return NextResponse.json({ conversation, messages: conversationMessages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
