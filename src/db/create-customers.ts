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

  if (users.length === 0) {
    console.info({ info: 'No users found without customerId' });
    return;
  }

  for (const user of users) {
    const customer = await createCustomerByEmailStripe({
      email: user.email,
      userId: user.id,
    });

    if (customer === undefined) {
      console.error({ error: `Failed to create customer for email: ${user.email}` });
      continue;
    }

    const newCustomer = await dbUpdateUserCustomerId({
      userId: user.id,
      customerId: customer.id,
    });

    if (newCustomer === undefined) {
      console.error({ error: `Failed to update user with email: ${user.email}` });
      continue;
    }

    console.info({ info: `Successfully created customer for user: ${newCustomer.id}` });
  }
}

createCustomers({ skip: false })
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    process.exit(1);
  });
