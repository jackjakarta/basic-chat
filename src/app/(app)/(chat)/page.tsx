import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getUser();
  const id = generateUUID();

  const [models, tokensUsed, subscriptionPlan] = await Promise.all([
    dbGetEnabledModels(),
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
    getSubscriptionPlanBySubscriptionState(user.subscription),
  ]);

  if (subscriptionPlan === undefined) {
    console.error('No subscription plan found for user:', user.id);
    throw new Error('No subscription plan found');
  }

  const { limits } = subscriptionPlan;

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      userFirstName={user.firstName}
      models={models}
      tokensUsed={tokensUsed}
      userLimits={limits}
    />
  );
}
