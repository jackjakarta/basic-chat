'use server';

import { dbDeleteConversationById, dbUpdateConversation } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';

export async function updateConversationTitleAction({
  conversationId,
  title,
}: {
  conversationId: string;
  title: string;
}) {
  const user = await getUser();

  const updatedConversation = await dbUpdateConversation({
    conversationId,
    data: { name: title },
    userId: user.id,
  });

  if (updatedConversation === undefined) {
    throw new Error('Failed to update conversation title');
  }

  return updatedConversation;
}

export async function deleteConversationAction({ conversationId }: { conversationId: string }) {
  const user = await getUser();
  await dbDeleteConversationById({ conversationId, userId: user.id });
}

export async function moveConversationToProjectAction({
  conversationId,
  chatProjectId,
}: {
  conversationId: string;
  chatProjectId: string | null;
}) {
  const user = await getUser();

  const updatedConversation = await dbUpdateConversation({
    conversationId,
    userId: user.id,
    data: { chatProjectId },
  });

  if (updatedConversation === undefined) {
    throw new Error('Failed to move conversation to project');
  }

  return updatedConversation;
}
