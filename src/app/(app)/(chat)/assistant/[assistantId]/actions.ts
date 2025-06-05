'use server';

import { dbDeleteAssistant, dbUpdateAssistant } from '@/db/functions/assistant';
import { dbDeleteFilesFromVectorStore } from '@/db/functions/vector-store';
import { type AssistantRow } from '@/db/schema';
import { deleteFile, deleteVectorStore } from '@/openai/files';
import { getUser } from '@/utils/auth';

export async function updateAssistantAction({
  assistantId,
  data,
}: {
  assistantId: string;
  data: Partial<AssistantRow>;
}) {
  const user = await getUser();
  const updatedAssistant = await dbUpdateAssistant({ assistantId, userId: user.id, data });

  if (updatedAssistant === undefined) {
    throw new Error('Failed to update assistant');
  }

  return updatedAssistant;
}

export async function deleteAssistantAction({
  assistantId,
  vectorStoreId,
}: {
  assistantId: string;
  vectorStoreId: string | null;
}) {
  const user = await getUser();

  if (vectorStoreId !== null) {
    await deleteVectorStore({ vectorStoreId, userId: user.id });
  }

  await dbDeleteAssistant({ assistantId, userId: user.id });
}

export async function deleteAgentFilesAction({
  vectorStoreId,
  fileIds,
}: {
  vectorStoreId: string;
  fileIds: string[];
}) {
  const user = await getUser();

  await dbDeleteFilesFromVectorStore({
    vectorStoreId,
    userId: user.id,
    fileIds,
  });

  await Promise.all(fileIds.map((fileId) => deleteFile({ fileId })));
}
