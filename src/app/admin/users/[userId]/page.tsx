import PageContainer from '@/components/common/page-container';
import { dbGetCustomerSubscriptionsStripe } from '@/db/functions/customer';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { dbGetUserById } from '@/db/functions/user';
import {
  getSubscriptionPlanBySubscriptionState,
  getSubscriptionStateBySubscriptions,
} from '@/stripe/subscription';
import { getUserAvatarUrl } from '@/utils/user';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { type ExtentedUser } from '../types';
import UserProfile from './user-profile';

const pageContextSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const parsedContext = pageContextSchema.safeParse(context);

  if (!parsedContext.success) {
    return notFound();
  }

  const { userId } = parsedContext.data.params;

  const user = await dbGetUserById({ userId });

  if (user === undefined) {
    return notFound();
  }

  const [tokensUsed, subscriptions] = await Promise.all([
    dbGetAmountOfTokensUsedByUserId({ userId: user.id }),
    dbGetCustomerSubscriptionsStripe({
      customerId: user.customerId,
    }),
  ]);

  const avatarUrl = getUserAvatarUrl(user);
  const subscription = getSubscriptionStateBySubscriptions({
    subscriptions,
    hasFreeTrial: user.customFreeTrial,
  });
  const subscriptionPlan = await getSubscriptionPlanBySubscriptionState(subscription);

  if (subscriptionPlan === undefined) {
    console.error('No subscription plan found for user:', user.id);
    throw new Error('No subscription plan found');
  }

  const { limits } = subscriptionPlan;

  const fullUser: ExtentedUser = {
    ...user,
    tokensUsed,
    subscription,
    avatarUrl,
    limits,
  };

  return (
    <PageContainer className="mx-auto w-full max-w-5xl">
      <UserProfile user={fullUser} />
    </PageContainer>
  );
}
