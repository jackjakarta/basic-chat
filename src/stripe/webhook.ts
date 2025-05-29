import { errorifyAsyncFn } from '@/utils/error';
import Stripe from 'stripe';

import { stripe } from '.';

export const stripeWebhooksConstructEventWithResult = errorifyAsyncFn(stripeWebhooksConstructEvent);
export async function stripeWebhooksConstructEvent({
  eventText,
  signature,
  stripeWebhookSecret,
}: {
  eventText: string;
  signature: string;
  stripeWebhookSecret: string;
}) {
  return stripe.webhooks.constructEvent(eventText, signature, stripeWebhookSecret);
}

export function getMaybeCustomerIdFromStripeEvent({ event }: { event: Stripe.Event | null }) {
  if (event === null) return undefined;

  try {
    const { customer: customerId } = event.data.object as {
      customer: string;
    };

    return customerId;
  } catch (error) {
    console.error({ error, event });
    return undefined;
  }
}
