import Chat from '@/components/chat/chat';
import { dbGetAgentById } from '@/db/functions/agent';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { filterChatMessages } from '@/utils/chat';
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

  const { agentId, chatId } = parsedParams.data.params;

  const [agent, models] = await Promise.all([
    dbGetAgentById({ agentId, userId: user.id }),
    dbGetEnabledModels(),
  ]);

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

  const filteredMessages = filterChatMessages({ chatMessages });

  return (
    <Chat
      key={chat.id}
      id={chat.id}
      initialMessages={filteredMessages}
      agentId={agentId}
      models={models}
      agentName={agent.name}
    />
  );
}
