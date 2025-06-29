'use server';

import { dbCreateNewUser, dbUpdateUserCustomerId } from '@/db/functions/user';
import { authProviderSchema } from '@/db/schema';
import { sendUserActionEmail } from '@/email/send';
import { createCustomerByEmailStripe } from '@/stripe/customer';
import { isDevMode } from '@/utils/dev-mode';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from '@/utils/schemas';
import { z } from 'zod';

const registerUserRequestSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  authProvider: authProviderSchema,
});

type RegisterUserRequestBody = z.infer<typeof registerUserRequestSchema>;

export async function registerNewUserAction(body: RegisterUserRequestBody) {
  const parsedBody = registerUserRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    throw new Error('Invalid request body');
  }

  const { firstName, lastName, email, password, authProvider } = parsedBody.data;

  const newUser = await dbCreateNewUser({
    email,
    password,
    firstName,
    lastName,
    authProvider,
  });

  const stripeCustomer = await createCustomerByEmailStripe({
    email: newUser.email,
    userId: newUser.id,
  });

  await dbUpdateUserCustomerId({
    userId: newUser.id,
    customerId: stripeCustomer.id,
  });

  if (authProvider === 'credentials' && !isDevMode) {
    await sendUserActionEmail({
      to: newUser.email,
      action: 'verify-email',
    });
  }

  return newUser;
}
