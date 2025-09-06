'use server';

import { dbDeleteChatProject, dbUpdateChatProject } from '@/db/functions/chat-project';
import { getUser } from '@/utils/auth';
import { type AllowedIcon, type IconColor } from '@/utils/icons';

export async function updateChatProjectNameAction({
  chatProjectId,
  name,
}: {
  chatProjectId: string;
  name: string;
}) {
  const user = await getUser();

  const updated = await dbUpdateChatProject({
    chatProjectId,
    userId: user.id,
    data: { name },
  });

  if (updated === undefined) {
    throw new Error('Chat project not found');
  }

  return updated;
}

export async function updateChatProjectIconAction({
  chatProjectId,
  icon,
  iconColor,
}: {
  chatProjectId: string;
  icon: AllowedIcon;
  iconColor?: IconColor;
}) {
  const user = await getUser();

  const updated = await dbUpdateChatProject({
    chatProjectId,
    userId: user.id,
    data: { icon, iconColor },
  });

  if (updated === undefined) {
    throw new Error('Chat project not found');
  }

  return updated;
}

export async function updateChatProjectSystemPromptAction({
  chatProjectId,
  systemPrompt,
}: {
  chatProjectId: string;
  systemPrompt: string | null;
}) {
  const user = await getUser();

  const updated = await dbUpdateChatProject({
    chatProjectId,
    userId: user.id,
    data: { systemPrompt },
  });

  if (updated === undefined) {
    throw new Error('Chat project not found');
  }

  return updated;
}

export async function deleteChatProjectAction({ chatProjectId }: { chatProjectId: string }) {
  const user = await getUser();
  const deleted = await dbDeleteChatProject({ chatProjectId, userId: user.id });

  if (deleted === undefined) {
    throw new Error('Chat project not found');
  }

  return deleted;
}
