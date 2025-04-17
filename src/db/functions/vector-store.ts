import {
  vectorStoreTable,
  type InsertVectorStoreRow,
  type VectorFile,
  type VectorStoreRow,
} from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

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
  files,
}: {
  vectorStoreId: string;
  userId: string;
  files: VectorFile[];
}) {
  const filesJson = JSON.stringify(files);

  const [vectorStore] = await db
    .update(vectorStoreTable)
    .set({
      files: sql`
        COALESCE(${vectorStoreTable.files}, '[]'::jsonb)
        || ${filesJson}::jsonb
      `,
    })
    .where(and(eq(vectorStoreTable.id, vectorStoreId), eq(vectorStoreTable.userId, userId)))
    .returning();

  return vectorStore;
}

export async function dbGetFilesFromVectorStore({
  vectorStoreId,
  userId,
}: {
  vectorStoreId: string;
  userId: string;
}) {
  const [vectorStore] = await db
    .select({ files: vectorStoreTable.files })
    .from(vectorStoreTable)
    .where(and(eq(vectorStoreTable.id, vectorStoreId), eq(vectorStoreTable.userId, userId)));

  return vectorStore;
}
