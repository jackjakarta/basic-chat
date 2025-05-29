import { createCustomerByEmailStripe } from '@/stripe/customer';
import { isNull } from 'drizzle-orm';

import { db } from '.';
import { dbUpdateUserCustomerId } from './functions/user';
import { userTable } from './schema';

async function createCustomers({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping AI models seeding' });
    return;
  }

  const users = await db.select().from(userTable).where(isNull(userTable.customerId));
  const userEmailsWithIds = users.map((user) => ({
    email: user.email,
    userId: user.id,
  }));

  for (const user of userEmailsWithIds) {
    const customer = await createCustomerByEmailStripe({
      email: user.email,
      userId: user.userId,
    });

    if (customer === undefined) {
      console.error(`Failed to create customer for email: ${user.email}`);
      continue;
    }

    const newCustomer = await dbUpdateUserCustomerId({
      userId: user.userId,
      customerId: customer.id,
    });

    if (newCustomer === undefined) {
      console.error(`Failed to update user with email: ${user.email}`);
    } else {
      console.log(`Successfully created customer for user: ${newCustomer.id}`);
    }
  }
}

createCustomers({ skip: false })
  .then(() => {
    console.info({ info: 'Customers created' });
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error({ error: 'AI models seeding failed', details: error });
    process.exit(1);
  });
