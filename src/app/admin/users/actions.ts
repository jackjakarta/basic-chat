'use server';

import { dbDeleteUser } from '@/db/functions/user';
import { getUser } from '@/utils/auth';

export async function deleteUserAction({ userId }: { userId: string }) {
  const user = await getUser();

  if (!user.isSuperAdmin) {
    throw new Error('Unauthorized: Only super admins can delete users.');
  }

  await dbDeleteUser({ userId });
}
