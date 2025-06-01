import { type SubscriptionState } from '@/stripe/subscription';
import { eq } from 'drizzle-orm';

import { db } from '..';
import { subscriptionPlanTable, type SubscriptionPlanRow } from '../schema';

type SubscriptionPlanId = Exclude<SubscriptionState, 'trialing'>;

export async function dbGetSubscriptionPlanById({
  planId,
}: {
  planId: SubscriptionPlanId;
}): Promise<SubscriptionPlanRow | undefined> {
  const [subscriptionPlan] = await db
    .select()
    .from(subscriptionPlanTable)
    .where(eq(subscriptionPlanTable.id, planId));

  return subscriptionPlan;
}

export async function dbGetSubscriptionPlans(): Promise<SubscriptionPlanRow[]> {
  const subscriptionPlans = await db.select().from(subscriptionPlanTable);

  return subscriptionPlans;
}
