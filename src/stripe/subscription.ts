import { dbGetSubscriptionPlanById } from '@/db/functions/subscription-plan';
import { SubscriptionPlanRow } from '@/db/schema';
import { stripe } from '@/stripe';
import Stripe from 'stripe';

export type SubscriptionState = 'premium' | 'free' | 'trialing';

export function getSubscriptionStateBySubscriptions({
  subscriptions,
  hasFreeTrial,
}: {
  subscriptions: Stripe.Subscription[];
  hasFreeTrial: boolean;
}): SubscriptionState {
  if (hasFreeTrial) {
    return 'premium';
  }

  const activeSubscription = subscriptions.find((s) => s.status === 'active');

  if (activeSubscription !== undefined) {
    return 'premium';
  }

  const trialingSubscription = subscriptions.find((s) => s.status === 'trialing');

  if (trialingSubscription !== undefined) {
    return 'trialing';
  }

  return 'free';
}

export async function getStripeSubscriptionsByCustomerId({
  customerId,
}: {
  customerId: string | null;
}) {
  if (customerId === null) return [];

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    return subscriptions.data;
  } catch (error) {
    console.error({ error });
    return [];
  }
}

export async function getSubscriptionPlanBySubscriptionState(
  subscriptionState: SubscriptionState,
): Promise<SubscriptionPlanRow | undefined> {
  switch (subscriptionState) {
    case 'premium':
    case 'trialing':
      return await dbGetSubscriptionPlanById({ planId: 'premium' });

    case 'free':
    default:
      return await dbGetSubscriptionPlanById({ planId: 'free' });
  }
}
