import { getTextEmbedding } from '@/openai/embed';
import { and, cosineDistance, desc, eq, gt, inArray, sql } from 'drizzle-orm';

import { db } from '..';
import { fileEmbeddingTable, fileTable } from '../schema';

export async function dbSearchSimilarFiles({
  searchQuery,
  userId,
  folderId,
  limit = 5,
}: {
  searchQuery: string;
  userId: string;
  folderId: string;
  limit?: number;
}) {
  const embedding = await getTextEmbedding({ input: searchQuery });

  if (embedding === undefined) {
    return [];
  }

  const folderFiles = await db
    .select({ id: fileTable.id })
    .from(fileTable)
    .where(and(eq(fileTable.folderId, folderId), eq(fileTable.userId, userId)));

  if (folderFiles.length === 0) {
    return [];
  }

  const folderFilesIds = folderFiles.map((file) => file.id);

  const similarity = sql<number>`1 - (${cosineDistance(fileEmbeddingTable.embedding, embedding)})`;

  const similarDocumentsEmbeddings = await db
    .select({ fileId: fileEmbeddingTable.fileId, similarity })
    .from(fileEmbeddingTable)
    .where(and(gt(similarity, 0.5), inArray(fileEmbeddingTable.fileId, folderFilesIds)))
    .orderBy((t) => desc(t.similarity))
    .limit(limit);

  const similarDocumentEmbeddingsFileIds = similarDocumentsEmbeddings.map((doc) => doc.fileId);

  if (similarDocumentEmbeddingsFileIds.length === 0) {
    return [];
  }

  const similarDocuments = await db
    .select()
    .from(fileTable)
    .where(
      and(inArray(fileTable.id, similarDocumentEmbeddingsFileIds), eq(fileTable.userId, userId)),
    );

  return similarDocuments;
}
