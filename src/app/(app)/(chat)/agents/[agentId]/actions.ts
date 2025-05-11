'use server';

import { dbDeleteAgent, dbUpdateAgent } from '@/db/functions/agent';
import { dbDeleteFilesFromVectorStore } from '@/db/functions/vector-store';
import { type AgentRow } from '@/db/schema';
import { deleteFile, deleteVectorStore } from '@/openai/files';
import { getUser } from '@/utils/auth';

export async function updateAgentAction({
  agentId,
  data,
}: {
  agentId: string;
  data: Partial<AgentRow>;
}) {
  const user = await getUser();
  const updatedAgent = await dbUpdateAgent({ agentId, userId: user.id, data });

  if (updatedAgent === undefined) {
    throw new Error('Failed to update agent');
  }

  return updatedAgent;
}

export async function deleteAgentAction({
  agentId,
  vectorStoreId,
}: {
  agentId: string;
  vectorStoreId: string | null;
}) {
  const user = await getUser();

  if (vectorStoreId !== null) {
    await deleteVectorStore({ vectorStoreId, userId: user.id });
  }

  await dbDeleteAgent({ agentId, userId: user.id });
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
