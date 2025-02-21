import Chat from '@/components/chat/chat';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    chatId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();

  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const chatId = parsedParams.data.params.chatId;

  const chat = await dbGetConversationById({ conversationId: chatId, userId: user.id });

  if (chat === undefined) {
    return notFound();
  }

  const rawChatMessages = await dbGetCoversationMessages({
    conversationId: chat.id,
    userId: user.id,
  });

  return <Chat key={chat.id} id={chat.id} initialMessages={rawChatMessages} />;
}
