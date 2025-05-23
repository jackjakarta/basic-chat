import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { filterChatMessages } from '@/utils/chat';
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

  const { chatId } = parsedParams.data.params;
  const [chat, models] = await Promise.all([
    dbGetConversationById({ conversationId: chatId, userId: user.id }),
    dbGetEnabledModels(),
  ]);

  if (chat === undefined) {
    return notFound();
  }

  const chatMessages = await dbGetCoversationMessages({
    conversationId: chat.id,
    userId: user.id,
  });

  const filteredMessages = filterChatMessages({ chatMessages });

  const messagesWithAttachments = filteredMessages.map((message) => ({
    ...message,
    experimental_attachments: message.attachments ?? undefined,
  }));

  return (
    <Chat key={chat.id} id={chat.id} initialMessages={messagesWithAttachments} models={models} />
  );
}
