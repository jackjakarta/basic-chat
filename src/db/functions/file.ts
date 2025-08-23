import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { fileTable, type FileRow, type InsertFileRow } from '../schema';

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
  const [deleted] = await db
    .delete(fileTable)
    .where(and(eq(fileTable.id, fileId), eq(fileTable.userId, userId)))
    .returning();

  return deleted;
}
