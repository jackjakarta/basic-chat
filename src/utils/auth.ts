import { authOptions } from '@/app/api/auth/[...nextauth]/utils';
import { dbGetCustomerSubscriptionsStripe } from '@/db/functions/customer';
import { dbGetUserById } from '@/db/functions/user';
import { type UserRow } from '@/db/schema';
import { getSubscriptionStateBySubscriptions, SubscriptionState } from '@/stripe/subscription';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export type UserAndContext = UserRow & {
  subscription: SubscriptionState;
};

export async function getValidSession() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect('/login');
  }

  return session;
}

export async function getMaybeUserSession() {
  return await getServerSession(authOptions);
}

export async function getUser(): Promise<UserAndContext> {
  const session = await getValidSession();
  const user = await dbGetUserById({ userId: session.user.id });

  if (user === undefined) {
    redirect('/login');
  }

  if (!user.emailVerified) {
    redirect('/verify-email');
  }

  const subscriptions = await dbGetCustomerSubscriptionsStripe({
    customerId: user.customerId,
  });

  return {
    ...user,
    subscription: getSubscriptionStateBySubscriptions({ subscriptions }),
  };
}

export async function getMaybeUser() {
  const session = await getMaybeUserSession();

  if (session === null) {
    return undefined;
  }

  const user = await dbGetUserById({ userId: session.user.id });

  return user;
}
