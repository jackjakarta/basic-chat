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
