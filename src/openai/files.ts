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
