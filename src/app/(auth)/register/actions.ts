'use server';

import { dbCreateNewUser } from '@/db/functions/user';
import { authProviderSchema } from '@/db/schema';
import { sendTestEmail } from '@/email/local';
import { sendUserActionEmail } from '@/email/send';
import { emailTemplateHtml } from '@/email/templates/verify-email';
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

  if (authProvider === 'credentials' && !isDevMode) {
    await sendUserActionEmail({
      to: newUser.email,
      action: 'verify-email',
    });

    return newUser;
  }

  await sendTestEmail({
    email: newUser.email,
    subject: 'Verify your email',
    html: emailTemplateHtml.replace('$REGISTER_CODE', 'K4AYJD'),
  });

  return newUser;
}
