import { errorifyAsyncFn } from '@/utils/error';

import { stripe } from '.';

export const createBillingPortalSessionWithResult = errorifyAsyncFn(createBillingPortalSession);
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const createCustomerPortalSessionResponse = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    locale: 'en',
  });

  return createCustomerPortalSessionResponse;
}
