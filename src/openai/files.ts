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

export async function createVectorStore({ assistantId }: { assistantId: string }) {
  const initialVs = await openai.vectorStores.create({
    name: `assistant-${assistantId}-vector-store`,
  });
  const vsId = initialVs.id;

  let vs = initialVs;
  const maxRetries = 60;
  const intervalMs = 1000;
  let tries = 0;

  while (vs.status !== 'completed') {
    if (vs.status === 'expired') {
      throw new Error(`Vector store ${vsId} expired before it could complete.`);
    }
    if (++tries > maxRetries) {
      throw new Error(`Timed out waiting for vector store ${vsId} to complete.`);
    }

    await new Promise((res) => setTimeout(res, intervalMs));

    vs = await openai.vectorStores.retrieve(vsId);
  }

  return vs;
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

  const result = await openai.vectorStores.delete(vectorStore.id);

  if (!result.deleted) {
    throw new Error(`Failed to delete vector store: ${JSON.stringify(result.object)}`);
  }

  const fileIds = vectorStore.files !== null ? vectorStore.files.map((file) => file.fileId) : [];

  if (fileIds.length > 0) {
    await Promise.all(fileIds.map((fileId) => deleteFile({ fileId })));
  }

  return result;
}

export async function uploadFileToOpenAi({ file }: { file: File }): Promise<VectorFile> {
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
  const response = await openai.files.delete(fileId);

  return response;
}
