import PageContainer from '@/components/common/page-container';
import { Button } from '@/components/ui/button';
import { dbGetSubscriptionPlans } from '@/db/functions/subscription-plan';

import PricingCards from '../billing/pricing-cards';

export default async function Page() {
  const plans = await dbGetSubscriptionPlans();

  return (
    <PageContainer className="mx-auto w-full pt-4 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-muted-foreground mb-4">Pricing</h1>
        <p className="text-xl text-muted-foreground/80">Choose the plan that fits your needs</p>
      </div>
      <PricingCards plans={plans} />
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8">Join thousands of users already using our platform</p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Start Your Free Trial
        </Button>
      </div>
    </PageContainer>
  );
}
