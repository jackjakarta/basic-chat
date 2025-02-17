'use server';

export async function deleteLastMessageForReload({ messageId }: { messageId: string | undefined }) {
  if (messageId === undefined) return;

  console.debug({ messageId });

  return;
}
