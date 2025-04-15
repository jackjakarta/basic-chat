import { vectorStoreTable, type InsertVectorStoreRow, type VectorStoreRow } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

import { db } from '..';

export async function dbGetVectorStoreById({
  vectorStoreId,
  userId,
}: {
  vectorStoreId: string;
  userId: string;
}): Promise<VectorStoreRow | undefined> {
  const [vectorStore] = await db
    .select()
    .from(vectorStoreTable)
    .where(and(eq(vectorStoreTable.id, vectorStoreId), eq(vectorStoreTable.userId, userId)));

  return vectorStore;
}

export async function dbInsertVectorStore(data: InsertVectorStoreRow) {
  const [vectorStore] = await db.insert(vectorStoreTable).values(data).returning();

  return vectorStore;
}

export async function dbAddFileIdsToVectorStore({
  vectorStoreId,
  userId,
  fileIds,
}: {
  vectorStoreId: string;
  userId: string;
  fileIds: string[];
}) {
  const [vectorStore] = await db
    .update(vectorStoreTable)
    .set({ fileIds })
    .where(and(eq(vectorStoreTable.id, vectorStoreId), eq(vectorStoreTable.userId, userId)))
    .returning();

  return vectorStore;
}
