'use server';

import { dbUpdateConversationTitle } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';

export async function updateConversationTitle({
  conversationId,
  title,
}: {
  conversationId: string;
  title: string;
}) {
  const user = await getUser();
  const updatedConversation = await dbUpdateConversationTitle({
    conversationId,
    name: title,
    userId: user.id,
  });

  if (updatedConversation === undefined) {
    throw new Error('Failed to update conversation title');
  }

  return updatedConversation;
}
