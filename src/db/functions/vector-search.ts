import { getSignedUrlFromS3Get } from '@/s3';
import { cosineDistance, desc, eq, inArray, sql } from 'drizzle-orm';

import { db } from '..';
import { fileEmbeddingTable, fileTable } from '../schema';
import { dbGetChatProjectFiles } from './file';

export async function dbSearchChatProjectFiles({
  chatProjectId,
  userId,
  queryEmbedding,
}: {
  chatProjectId: string;
  userId: string;
  queryEmbedding: number[];
}) {
  const similarity = sql<number>`1 - (${cosineDistance(fileEmbeddingTable.embedding, queryEmbedding)})`;

  const chatProjectFiles = await dbGetChatProjectFiles({ userId, chatProjectId });

  if (chatProjectFiles.length === 0) {
    return [];
  }

  const fileIds = chatProjectFiles.map((file) => file.id);

  const relevantDocuments = await db
    .select({
      fileId: fileEmbeddingTable.fileId,
      fileType: fileTable.mimeType,
      fileName: fileTable.name,
      offsetStart: fileEmbeddingTable.chunkIndex,
      content: fileEmbeddingTable.chunkText,
      s3BucketKey: fileTable.s3BucketKey,
      similarity,
    })
    .from(fileEmbeddingTable)
    .innerJoin(fileTable, eq(fileTable.id, fileEmbeddingTable.fileId))
    .where(inArray(fileEmbeddingTable.fileId, fileIds))
    .orderBy((t) => desc(t.similarity))
    .limit(15);

  const filesById: Record<
    string,
    {
      fileId: string;
      fileType: string;
      fileName: string;
      offsetStart: number;
      content: string;
      similarity: number;
    }[]
  > = {};

  for (const doc of relevantDocuments) {
    const fileId = doc.fileId;
    if (fileId in filesById) {
      filesById[fileId]?.push(doc);
      continue;
    }
    filesById[fileId] = [doc];
  }

  const documentsWithUrl = await Promise.all(
    relevantDocuments.map(async (doc) => {
      const url = await getSignedUrlFromS3Get({
        key: doc.s3BucketKey,
        filename: doc.fileName,
        contentType: doc.fileType,
      });

      return {
        ...doc,
        url,
        s3BucketKey: 'hidden',
      };
    }),
  );

  return documentsWithUrl;
}
