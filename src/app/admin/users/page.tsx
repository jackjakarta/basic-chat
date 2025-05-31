import PageContainer from '@/components/common/page-container';
import { dbGetCustomerSubscriptionsStripe } from '@/db/functions/customer';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { dbGetAllUsers } from '@/db/functions/user';
import {
  getSubscriptionPlanBySubscriptionState,
  getSubscriptionStateBySubscriptions,
} from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { getUserAvatarUrl } from '@/utils/user';

import { type ExtentedUser } from './types';
import UsersTable from './users-table';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [user, users] = await Promise.all([getUser(), dbGetAllUsers()]);

  const usersWithTokensAvatar: ExtentedUser[] = await Promise.all(
    users.map(async (user) => {
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

      const fullUser: ExtentedUser = { ...user, tokensUsed, avatarUrl, subscription, limits };

      return fullUser;
    }),
  );

  return (
    <PageContainer className="mx-auto w-full">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <UsersTable users={usersWithTokensAvatar} currentUserId={user.id} />
      </div>
    </PageContainer>
  );
}
