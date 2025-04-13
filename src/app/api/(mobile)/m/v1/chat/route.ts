import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { summarizeConversationTitle } from '@/openai/text';
import { openai } from '@ai-sdk/openai';
import { smoothStream, streamText } from 'ai';
import { NextResponse } from 'next/server';

import { getUserFromHeaders } from '../utils';

export async function POST(req: Request) {
  const decryptedToken = getUserFromHeaders(req.headers);
  const userId = decryptedToken.id;

  const { messages, conversationId } = await req.json();
  console.debug({ userId, conversationId });

  const conversation = await dbGetOrCreateConversation({
    userId,
    conversationId,
  });

  if (conversation === undefined) {
    return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
  }

  const userMessage = messages[messages.length - 1]?.content;

  await dbInsertChatContent({
    conversationId: conversation.id,
    content: userMessage ?? '',
    role: 'user',
    userId: decryptedToken.id,
    orderNumber: messages.length,
  });

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    experimental_transform: smoothStream({
      delayInMs: 30,
      chunking: 'word',
    }),
    async onFinish(assistantMessage) {
      await dbInsertChatContent({
        content: assistantMessage.text,
        role: 'assistant',
        userId: decryptedToken.id,
        orderNumber: messages.length + 1,
        conversationId: conversation.id,
      });

      if (messages.length === 1 || messages.length === 2 || conversation.name === null) {
        const conversationTitle = await summarizeConversationTitle({
          userMessage: userMessage ?? '',
          assistantMessage: assistantMessage.text,
        });

        await dbUpdateConversationTitle({
          conversationId: conversation.id,
          name: conversationTitle,
          userId: decryptedToken.id,
        });
      }
    },
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
