'use server';

import { dbCreateChatProject } from '@/db/functions/chat-project';
import { type InsertChatProjectRow } from '@/db/schema';
import { getUser } from '@/utils/auth';

type RequestBody = Omit<InsertChatProjectRow, 'userId'>;

export async function createChatProjectAction(body: RequestBody) {
  const user = await getUser();

  const chatProject = await dbCreateChatProject({
    ...body,
    userId: user.id,
  });

  if (chatProject === undefined) {
    throw new Error('Failed to create chat project');
  }

  return chatProject;
}
