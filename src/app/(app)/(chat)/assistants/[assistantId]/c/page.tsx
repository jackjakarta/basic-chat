import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetAssistantById } from '@/db/functions/assistant';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    assistantId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const id = generateUUID();
  const { assistantId } = parsedParams.data.params;

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

  if (assistant === undefined) {
    return notFound();
  }

  const { limits } = subscriptionPlan;
  const { totalTokens } = tokensUsed;

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      assistantId={assistant.id}
      assistantName={assistant.name}
      models={models}
      tokensUsed={totalTokens}
      userLimits={limits}
      userFirstName={user.firstName}
    />
  );
}
