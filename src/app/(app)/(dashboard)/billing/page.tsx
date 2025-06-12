import PageContainer from '@/components/common/page-container';
import { Button } from '@/components/ui/button';
import { dbGetSubscriptionPlans } from '@/db/functions/subscription-plan';
import { createBillingPortalSessionWithResult } from '@/stripe/billing-portal';
import { getStripeSubscriptionsByCustomerId } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { getBaseUrlByHeaders } from '@/utils/host';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import PricingCards from './pricing-cards';

export default async function Page() {
  const [user, plans, t] = await Promise.all([
    getUser(),
    dbGetSubscriptionPlans(),
    getTranslations('billing'),
  ]);

  if (user.customFreeTrial) {
    redirect('/');
  }

  const customerId = user.customerId;

  if (customerId === null) {
    console.error('Checkout session cannot be created as the user has no customer id');
    redirect('/');
  }

  const subscriptions = await getStripeSubscriptionsByCustomerId({
    customerId,
  });

  const validSubscriptionExists = subscriptions.some(
    (s) => s.status === 'active' || s.status === 'trialing',
  );

  if (!validSubscriptionExists) {
    return (
      <PageContainer className="mx-auto w-full pt-4 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-muted-foreground mb-4">{t('pricing')}</h1>
          <p className="text-xl text-muted-foreground/80">{t('choose-plan')}</p>
        </div>
        <PricingCards plans={plans} />
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-4">
            {t('ready-get-started')}
          </h2>
          <p className="text-gray-600 mb-8">{t('join')}</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            {t('start-trial')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  const baseUrl = getBaseUrlByHeaders();

  const [error, portalSession] = await createBillingPortalSessionWithResult({
    customerId,
    returnUrl: baseUrl,
  });

  if (error !== null) {
    console.error({ error });
    redirect('/');
  }

  redirect(portalSession.url);
}
