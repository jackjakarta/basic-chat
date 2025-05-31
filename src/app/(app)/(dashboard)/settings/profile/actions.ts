'use server';

import { dbDeleteAllConversationsByUserId } from '@/db/functions/chat';
import { dbUpdateUserName, dbUpdateUserPassword, dbUpdateUserSettings } from '@/db/functions/user';
import { type UserSettings } from '@/db/schema';
import { getUser } from '@/utils/auth';
import { passwordSchema } from '@/utils/schemas';

export async function updateUserPasswordAction({ newPassword }: { newPassword: string }) {
  const user = await getUser();
  const parsedPassword = passwordSchema.safeParse(newPassword);

  if (!parsedPassword.success) {
    throw new Error('Invalid password');
  }

  const validPassword = parsedPassword.data;
  const updatedUser = await dbUpdateUserPassword({ email: user.email, password: validPassword });

  return updatedUser;
}

export async function updateUserSettingsAction({ settings }: { settings: UserSettings }) {
  const user = await getUser();
  const updatedUser = await dbUpdateUserSettings({
    userId: user.id,
    settings,
  });

  return updatedUser;
}

export async function deleteAllConversationsAction() {
  const user = await getUser();
  await dbDeleteAllConversationsByUserId({ userId: user.id });
}

export async function updateUserNameAction({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const user = await getUser();
  const updatedUser = await dbUpdateUserName({
    userId: user.id,
    firstName,
    lastName,
  });

  return updatedUser;
}
