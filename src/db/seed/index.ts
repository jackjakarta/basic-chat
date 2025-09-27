import { db } from '@/db';
import { createCustomerByEmailStripe } from '@/stripe/customer';
import { eq } from 'drizzle-orm';

import { MOCK_USER } from '../../../e2e/utils';
import { hashPassword } from '../crypto';
import {
  aiModelTable,
  conversationTable,
  dataSourceIntegrationTable,
  subscriptionPlanTable,
  userTable,
  type InsertUserRow,
} from '../schema';
import { conversations } from './conversations';
import { dataSourceIntegrations } from './data-source-integrations';
import { models } from './models';
import { subscriptionPlans } from './subscription-plans';

Promise.all([
  seedAIModels({ skip: false }),
  seedSubscriptionPlans({ skip: false }),
  seedDataSourceIntegrations({ skip: false }),
  seedMockE2EUser({ skip: false }),
  seedConversations({ skip: true }),
])
  .then(() => {
    console.info({ info: 'Seeding completed' });
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error({ error: 'Seeding failed', details: error });
    process.exit(1);
  });

async function seedAIModels({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping AI models seeding' });
    return;
  }

  for (const model of models) {
    const insertedModel = await db
      .insert(aiModelTable)
      .values(model)
      .onConflictDoNothing({ target: aiModelTable.id });

    console.info({ insertedModel });
  }
}

async function seedSubscriptionPlans({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping subscription plans seeding' });
    return;
  }

  for (const plan of subscriptionPlans) {
    const insertedPlan = await db
      .insert(subscriptionPlanTable)
      .values(plan)
      .onConflictDoNothing({ target: subscriptionPlanTable.id });

    console.info({ insertedPlan });
  }
}

async function seedDataSourceIntegrations({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping data source integrations seeding' });
    return;
  }

  for (const integration of dataSourceIntegrations) {
    const insertedIntegration = await db
      .insert(dataSourceIntegrationTable)
      .values(integration)
      .onConflictDoNothing({ target: dataSourceIntegrationTable.id });

    console.info({ insertedIntegration });
  }
}

async function seedConversations({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping conversations seeding' });
    return;
  }

  for (const conversation of conversations) {
    const insertedConversation = await db
      .insert(conversationTable)
      .values(conversation)
      .onConflictDoNothing({ target: conversationTable.id });

    console.info({ insertedConversation });
  }
}

async function seedMockE2EUser({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping mock E2E user seeding' });
    return;
  }

  const fullUser: InsertUserRow = {
    id: '3078f3c5-d14c-4f40-bb0f-723c953cd69c',
    email: MOCK_USER.email,
    passwordHash: await hashPassword(MOCK_USER.password),
    firstName: 'E2E',
    lastName: 'Test',
    emailVerified: true,
    authProvider: 'credentials',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [insertedUser] = await db
    .insert(userTable)
    .values(fullUser)
    .onConflictDoNothing({ target: userTable.id })
    .returning();

  if (insertedUser === undefined) {
    return;
  }

  const stripeCustomer = await createCustomerByEmailStripe({
    email: insertedUser.email,
    userId: insertedUser.id,
  });

  await db
    .update(userTable)
    .set({ customerId: stripeCustomer.id })
    .where(eq(userTable.id, insertedUser.id));

  console.info({ insertedUser });
}
