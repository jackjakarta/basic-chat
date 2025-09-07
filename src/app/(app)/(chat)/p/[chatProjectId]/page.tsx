import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetChatProjectAndConversations } from '@/db/functions/chat-project';
import { dbGetChatProjectFiles } from '@/db/functions/file';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    chatProjectId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();

  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const { chatProjectId } = parsedParams.data.params;

  const chatProject = await dbGetChatProjectAndConversations({
    chatProjectId,
    userId: user.id,
  });

  if (chatProject === undefined) {
    return notFound();
  }

  const id = generateUUID();

  const [models, tokensUsed, subscriptionPlan, chatProjectFiles] = await Promise.all([
    dbGetEnabledModels(),
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
    getSubscriptionPlanBySubscriptionState(user.subscription),
    dbGetChatProjectFiles({ chatProjectId: chatProject.id, userId: user.id }),
  ]);

  const last5ChatProjectFiles = chatProjectFiles.slice(0, 5);

  if (subscriptionPlan === undefined) {
    console.error('No subscription plan found for user:', user.id);
    throw new Error('No subscription plan found');
  }

  const { limits } = subscriptionPlan;
  const { totalTokens } = tokensUsed;

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      userFirstName={user.firstName}
      models={models}
      tokensUsed={totalTokens}
      chatProject={chatProject}
      userLimits={limits}
      chatProjectFiles={last5ChatProjectFiles}
    />
  );
}
