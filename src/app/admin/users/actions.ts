'use server';

import { dbDeleteUser } from '@/db/functions/user';
import { getSuperAdmin } from '@/utils/auth';

export async function deleteUserAction({ userId }: { userId: string }) {
  await getSuperAdmin();
  await dbDeleteUser({ userId });
}
