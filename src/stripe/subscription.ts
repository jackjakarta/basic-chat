import { stripe } from '@/stripe';
import Stripe from 'stripe';

export type SubscriptionLimits = {
  tokenLimit: number;
  messagesLimit?: number;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  limits: SubscriptionLimits;
};

export type SubscriptionState = 'premium' | 'free' | 'trialing';

export function getSubscriptionStateBySubscriptions({
  subscriptions,
}: {
  subscriptions: Stripe.Subscription[];
}): SubscriptionState {
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

export function getSubscriptionPlanBySubscriptionState(
  subscriptionState: SubscriptionState,
): SubscriptionPlan {
  switch (subscriptionState) {
    case 'premium':
      return PREMIUM_PLAN;
    case 'trialing':
      return PREMIUM_PLAN;
    case 'free':
    default:
      return FREE_PLAN;
  }
}

export const FREE_PLAN: SubscriptionPlan = {
  id: 'free',
  name: 'Free Plan',
  price: 0,
  description: 'Enjoy our free plan with limited features.',
  limits: {
    tokenLimit: 100000,
    messagesLimit: 5,
  },
};

export const PREMIUM_PLAN: SubscriptionPlan = {
  id: 'premium',
  name: 'Premium Plan',
  price: 999, // in cents
  description: 'Unlock premium features with our subscription plan.',
  limits: {
    tokenLimit: 800000,
    messagesLimit: undefined,
  },
};
