'use server';

import { dbDeleteAllConversationsByUserId } from '@/db/functions/chat';
import { dbUpdateUserPassword, dbUpdateUserSettings } from '@/db/functions/user';
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

export async function updateUserSettingsAction({
  customInstructions,
}: {
  customInstructions: string;
}) {
  const user = await getUser();
  const updatedUser = await dbUpdateUserSettings({ userId: user.id, customInstructions });

  return updatedUser;
}

export async function deleteAllConversationsAction() {
  const user = await getUser();
  await dbDeleteAllConversationsByUserId({ userId: user.id });
}
