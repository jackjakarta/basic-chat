'use server';

import { dbDeleteActionToken, dbValidateToken } from '@/db/functions/token';
import { dbGetUserByEmail, dbUpdateUserPassword } from '@/db/functions/user';
import { sendUserActionEmail, sendUserActionInformationEmail } from '@/email/send';
import { isDevMode } from '@/utils/dev-mode';

export async function updateUserPassword({
  email,
  password,
  token,
}: {
  email: string;
  password: string;
  token: string;
}) {
  const userActionRow = await dbValidateToken(token);

  if (
    userActionRow === undefined ||
    userActionRow.token !== token ||
    userActionRow.action !== 'reset-password'
  ) {
    throw new Error('Invalid token');
  }

  const updatedUser = await dbUpdateUserPassword({ email, password });

  if (updatedUser === undefined) {
    throw new Error('Failed to update user password');
  }

  await dbDeleteActionToken({ token });

  if (!isDevMode) {
    await sendUserActionInformationEmail({
      to: updatedUser?.email,
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
  return await sendUserActionEmail({ to: email, action: 'reset-password' });
}
