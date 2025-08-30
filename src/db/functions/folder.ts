import { type WithFiles } from '@/types/files';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '..';
import {
  fileEmbeddingTable,
  fileTable,
  folderTable,
  type FolderRow,
  type InsertFolderRow,
} from '../schema';

export async function dbGetFoldersByUserId({ userId }: { userId: string }): Promise<FolderRow[]> {
  const folders = await db
    .select()
    .from(folderTable)
    .where(eq(folderTable.userId, userId))
    .orderBy(desc(folderTable.updatedAt));

  return folders;
}

export async function dbGetFolderById({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}): Promise<FolderRow | undefined> {
  const [folder] = await db
    .select()
    .from(folderTable)
    .where(and(eq(folderTable.id, folderId), eq(folderTable.userId, userId)));

  return folder;
}

export async function dbInsertFolder(data: InsertFolderRow): Promise<FolderRow | undefined> {
  const [folder] = await db.insert(folderTable).values(data).returning();

  return folder;
}

export type UpdateFolderData = Partial<Omit<FolderRow, 'id' | 'userId'>>;

export async function dbUpdateFolder({
  folderId,
  userId,
  data,
}: {
  folderId: string;
  userId: string;
  data: UpdateFolderData;
}): Promise<FolderRow | undefined> {
  const [folder] = await db
    .update(folderTable)
    .set(data)
    .where(and(eq(folderTable.id, folderId), eq(folderTable.userId, userId)))
    .returning();

  return folder;
}

export async function dbDeleteFolder({ folderId, userId }: { folderId: string; userId: string }) {
  const deleted = await db.transaction(async (tx) => {
    const folderFiles = await tx
      .select()
      .from(fileTable)
      .where(and(eq(fileTable.folderId, folderId), eq(fileTable.userId, userId)));

    if (folderFiles.length > 0) {
      for (const file of folderFiles) {
        await tx.delete(fileEmbeddingTable).where(eq(fileEmbeddingTable.fileId, file.id));
        await tx
          .delete(fileTable)
          .where(and(eq(fileTable.id, file.id), eq(fileTable.userId, userId)));
      }
    }

    const [deletedFolder] = await tx
      .delete(folderTable)
      .where(and(eq(folderTable.id, folderId), eq(folderTable.userId, userId)))
      .returning();

    return deletedFolder;
  });

  return deleted;
}

export type FolderAndFiles = WithFiles<FolderRow>;

export async function dbGetFolderAndFiles({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}): Promise<FolderAndFiles | undefined> {
  const folder = await dbGetFolderById({ folderId, userId });

  if (folder === undefined) {
    return undefined;
  }

  const files = await db
    .select()
    .from(fileTable)
    .where(eq(fileTable.folderId, folderId))
    .orderBy(desc(fileTable.updatedAt));

  return { ...folder, files };
}
