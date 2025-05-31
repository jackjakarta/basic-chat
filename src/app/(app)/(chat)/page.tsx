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

  const [models, tokensUsed] = await Promise.all([
    dbGetEnabledModels(),
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
  ]);

  const { limits } = getSubscriptionPlanBySubscriptionState(user.subscription);

  console.debug({ subscription: user.subscription, limits });

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      userFirstName={user.firstName}
      models={models}
      tokensUsed={tokensUsed}
      userLimits={limits}
      userSubscription={user.subscription}
    />
  );
}
