import Chat from '@/components/chat/chat';
import { dbGetAgentById } from '@/db/functions/agent';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
    chatId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const agentId = parsedParams.data.params.agentId;
  const chatId = parsedParams.data.params.chatId;

  const agent = await dbGetAgentById({ agentId, userId: user.id });

  if (agent === undefined) {
    return notFound();
  }

  const chat = await dbGetConversationById({
    conversationId: chatId,
    userId: user.id,
    agentId: agent.id,
  });

  if (chat === undefined) {
    return notFound();
  }

  const chatMessages = await dbGetCoversationMessages({
    conversationId: chat.id,
    userId: user.id,
  });

  const filteredMessages = Array.from(
    chatMessages
      .filter((message) => message.content !== '')
      .reduce((map, message) => {
        const existingMessage = map.get(message.orderNumber);
        if (!existingMessage || existingMessage.createdAt < message.createdAt) {
          map.set(message.orderNumber, message);
        }
        return map;
      }, new Map<number, (typeof chatMessages)[0]>())
      .values(),
  );

  return <Chat key={chat.id} id={chat.id} initialMessages={filteredMessages} agentId={agentId} />;
}
