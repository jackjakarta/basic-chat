'use server';

import { dbDeleteActionToken, dbValidateToken } from '@/db/functions/token';
import { dbGetUserByEmail, dbUpdateUserPassword } from '@/db/functions/user';
import { sendUserActionEmail, sendUserActionInformationEmail } from '@/email/send';
import { isDevMode } from '@/utils/dev-mode';
import { z } from 'zod';

const updatePasswordRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
  token: z.string(),
});

type UpdatePasswordRequestBody = z.infer<typeof updatePasswordRequestSchema>;

export async function updateUserPassword(body: UpdatePasswordRequestBody) {
  const parsed = updatePasswordRequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error('Invalid request body');
  }

  const { email, password, token } = parsed.data;
  const userActionRow = await dbValidateToken(token);

  if (userActionRow === undefined || userActionRow.action !== 'reset-password') {
    throw new Error('Invalid token');
  }

  const updatedUser = await dbUpdateUserPassword({ email, password });

  if (updatedUser === undefined) {
    throw new Error('Failed to update user password');
  }

  await dbDeleteActionToken({ token });

  if (!isDevMode) {
    await sendUserActionInformationEmail({
      to: updatedUser.email,
      information: { type: 'reset-password-success' },
    });
  }

  return updatedUser;
}

export async function getUserByEmail({ email }: { email: string }) {
  const user = await dbGetUserByEmail({ email });

  return { email: user?.email };
}

export async function sendPasswordResetEmail({ email }: { email: string }) {
  const user = await dbGetUserByEmail({ email });

  if (user === undefined) {
    throw new Error('User not found');
  }

  if (isDevMode) {
    return undefined;
  }

  const emailResult = await sendUserActionEmail({ to: email, action: 'reset-password' });

  return emailResult;
}
