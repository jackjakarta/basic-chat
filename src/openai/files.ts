import { dbGetVectorStoreById } from '@/db/functions/vector-store';
import { type VectorFile } from '@/db/schema';

import { openai } from '.';

export async function addFileIdsToVectorStore({
  vectorStoreId,
  fileIds,
}: {
  vectorStoreId: string;
  fileIds: string[];
}) {
  const result = await openai.vectorStores.fileBatches.createAndPoll(vectorStoreId, {
    file_ids: fileIds,
  });

  return result;
}

export async function createVectorStore({ agentId }: { agentId: string }) {
  const vectorStore = await openai.vectorStores.create({
    name: `agent-${agentId}-vector-store`,
  });

  return vectorStore;
}

export async function deleteVectorStore({
  vectorStoreId,
  userId,
}: {
  vectorStoreId: string;
  userId: string;
}) {
  const vectorStore = await dbGetVectorStoreById({ vectorStoreId, userId });

  if (vectorStore === undefined) {
    throw new Error(`Vector store with ID ${vectorStoreId} not found`);
  }

  const result = await openai.vectorStores.del(vectorStore.id);

  if (!result.deleted) {
    throw new Error(`Failed to delete vector store: ${JSON.stringify(result.object)}`);
  }

  const fileIds = vectorStore.files !== null ? vectorStore.files.map((file) => file.fileId) : [];

  if (fileIds.length > 0) {
    await Promise.all(fileIds.map((fileId) => deleteFile({ fileId })));
  }

  return result;
}

export async function uploadFile({ file }: { file: File }): Promise<VectorFile> {
  const response = await openai.files.create({
    file,
    purpose: 'user_data',
  });

  return {
    fileId: response.id,
    fileName: response.filename,
  };
}

export async function deleteFile({ fileId }: { fileId: string }) {
  const response = await openai.files.del(fileId);

  return response;
}
