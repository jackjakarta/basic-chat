import { dbUpdateCustomerSubscriptions } from '@/db/functions/customer';
import { env } from '@/env';
import { getStripeSubscriptionsByCustomerId } from '@/stripe/subscription';
import {
  getMaybeCustomerIdFromStripeEvent,
  stripeWebhooksConstructEventWithResult,
} from '@/stripe/webhook';
import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature');

  if (signature === null) {
    console.warn(
      'payment',
      "Got a request at webhook endpoint that doesn't contain a stripe-signature header.",
      undefined,
    );

    return Response.json({ error: 'Signature check failed.' }, { status: 400 });
  }

  const eventText = await req.text();

  const [eventConstructError, event] = await stripeWebhooksConstructEventWithResult({
    eventText,
    signature,
    stripeWebhookSecret: env.stripeWebhookSecret,
  });

  if (eventConstructError !== null) {
    console.error({ eventConstructError });
    console.warn(
      'payment',
      'Failed to construct webhook event. This mostly means an invalid request was received by the handle-webhoook endpoint.',
      undefined,
    );

    return Response.json({ error: 'Failed to construct webhook event' }, { status: 400 });
  }

  const customerId = getMaybeCustomerIdFromStripeEvent({ event });

  if (customerId === undefined) {
    return Response.json({ error: 'Failed to get customer id from event' }, { status: 400 });
  }

  const subscriptions = await getStripeSubscriptionsByCustomerId({
    customerId,
  });

  await dbUpdateCustomerSubscriptions({ customerId, subscriptions });

  return Response.json({ message: 'Ok' }, { status: 200 });
}
