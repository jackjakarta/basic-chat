import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetAssistantById } from '@/db/functions/assistant';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { filterChatMessages } from '@/utils/chat';
import { type Message } from 'ai';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    assistantId: z.string().uuid(),
    chatId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const { assistantId, chatId } = parsedParams.data.params;

  const [models, assistant, tokensUsed, subscriptionPlan] = await Promise.all([
    dbGetEnabledModels(),
    dbGetAssistantById({ assistantId, userId: user.id }),
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
    getSubscriptionPlanBySubscriptionState(user.subscription),
  ]);

  if (subscriptionPlan === undefined) {
    console.error('No subscription plan found for user:', user.id);
    throw new Error('No subscription plan found');
  }

  const { limits } = subscriptionPlan;
  const { totalTokens } = tokensUsed;

  if (assistant === undefined) {
    return notFound();
  }

  const chat = await dbGetConversationById({
    conversationId: chatId,
    userId: user.id,
    assistantId: assistant.id,
  });

  if (chat === undefined) {
    return notFound();
  }

  const chatMessages = await dbGetCoversationMessages({
    conversationId: chat.id,
    userId: user.id,
  });

  const filteredMessages = filterChatMessages(chatMessages);

  const messagesWithAttachments: Message[] = filteredMessages.map((message) => ({
    ...message,
    experimental_attachments: message.attachments ?? undefined,
    attachments: null,
  }));

  return (
    <Chat
      key={chat.id}
      id={chat.id}
      initialMessages={messagesWithAttachments}
      assistantId={assistantId}
      models={models}
      tokensUsed={totalTokens}
      userLimits={limits}
      assistantName={assistant.name}
    />
  );
}
