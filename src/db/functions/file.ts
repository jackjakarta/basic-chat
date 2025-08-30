import { and, eq } from 'drizzle-orm';

import { db } from '..';
import {
  fileEmbeddingTable,
  fileTable,
  type FileEmbeddingRow,
  type FileRow,
  type InsertFileEmbeddingRow,
  type InsertFileRow,
} from '../schema';

export async function dbGetFileById({
  fileId,
  userId,
}: {
  fileId: string;
  userId: string;
}): Promise<FileRow | undefined> {
  const [file] = await db
    .select()
    .from(fileTable)
    .where(and(eq(fileTable.id, fileId), eq(fileTable.userId, userId)));

  return file;
}

export async function dbGetFilesByUserId({ userId }: { userId: string }): Promise<FileRow[]> {
  const files = await db.select().from(fileTable).where(eq(fileTable.userId, userId));

  return files;
}

export async function dbInsertFile(data: InsertFileRow): Promise<FileRow | undefined> {
  const [file] = await db.insert(fileTable).values(data).returning();

  return file;
}

type UpdateFileRow = Omit<FileRow, 'id' | 'userId'>;

export async function dbUpdateFile({
  fileId,
  userId,
  data,
}: {
  fileId: string;
  userId: string;
  data: Partial<UpdateFileRow>;
}): Promise<FileRow | undefined> {
  const [file] = await db
    .update(fileTable)
    .set(data)
    .where(and(eq(fileTable.id, fileId), eq(fileTable.userId, userId)))
    .returning();

  return file;
}

export async function dbDeleteFile({
  fileId,
  userId,
}: {
  fileId: string;
  userId: string;
}): Promise<FileRow | undefined> {
  const maybeDeleted = await db.transaction(async (tx) => {
    await tx.delete(fileEmbeddingTable).where(eq(fileEmbeddingTable.fileId, fileId));

    const [deleted] = await tx
      .delete(fileTable)
      .where(and(eq(fileTable.id, fileId), eq(fileTable.userId, userId)))
      .returning();

    return deleted;
  });

  return maybeDeleted;
}

export async function dbInsertEmbedding(
  data: InsertFileEmbeddingRow,
): Promise<FileEmbeddingRow | undefined> {
  const [embeddingRow] = await db.insert(fileEmbeddingTable).values(data).returning();

  return embeddingRow;
}

export async function dbGetFilesByFolderId({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}): Promise<FileRow[]> {
  const files = await db
    .select()
    .from(fileTable)
    .where(and(eq(fileTable.folderId, folderId), eq(fileTable.userId, userId)));

  return files;
}
