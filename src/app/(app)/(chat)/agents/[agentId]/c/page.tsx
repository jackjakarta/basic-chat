import Chat from '@/components/chat/chat';
import { dbGetAgentById } from '@/db/functions/agent';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const id = generateUUID();
  const { agentId } = parsedParams.data.params;

  const [models, agent, tokensUsed, subscriptionPlan] = await Promise.all([
    dbGetEnabledModels(),
    dbGetAgentById({ agentId, userId: user.id }),
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
    getSubscriptionPlanBySubscriptionState(user.subscription),
  ]);

  if (subscriptionPlan === undefined) {
    console.error('No subscription plan found for user:', user.id);
    throw new Error('No subscription plan found');
  }

  if (agent === undefined) {
    return notFound();
  }

  const { limits } = subscriptionPlan;

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      agentId={agent.id}
      agentName={agent.name}
      models={models}
      tokensUsed={tokensUsed}
      userLimits={limits}
      userFirstName={user.firstName}
    />
  );
}
