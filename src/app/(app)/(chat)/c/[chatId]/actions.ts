'use server';

import { getUser } from '@/utils/auth';

export async function deleteLastMessageForReload({ messageId }: { messageId: string | undefined }) {
  await getUser();

  if (messageId === undefined) return;

  console.debug({ messageId });
}
