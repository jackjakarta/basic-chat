import { and, desc, eq, ilike, sql } from 'drizzle-orm';

import { db } from '..';
import {
  conversationMessageTable,
  conversationTable,
  InsertConversationMessageRow,
} from '../schema';

export async function dbGetOrCreateConversation({
  conversationId,
  userId,
  assistantId,
  chatProjectId,
}: {
  conversationId: string;
  userId: string;
  assistantId?: string;
  chatProjectId?: string;
}) {
  const [conversation] = await db
    .insert(conversationTable)
    .values({ id: conversationId, userId, assistantId, chatProjectId })
    .onConflictDoUpdate({
      target: conversationTable.id,
      set: { id: conversationId },
    })
    .returning();

  return conversation;
}

export async function dbGetCoversationMessages({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
}) {
  const messages = await db
    .select()
    .from(conversationMessageTable)
    .innerJoin(conversationTable, eq(conversationMessageTable.conversationId, conversationTable.id))
    .where(
      and(
        eq(conversationMessageTable.conversationId, conversationId),
        eq(conversationTable.userId, userId),
      ),
    )
    .orderBy(conversationMessageTable.orderNumber);
  return messages.map((message) => message.conversation_message);
}

export async function dbInsertChatContent(chatContent: InsertConversationMessageRow) {
  const [newChatContent] = await db
    .insert(conversationMessageTable)
    .values(chatContent)
    .returning();

  return newChatContent;
}

export async function dbGetConversations({ userId, limit }: { userId: string; limit?: number }) {
  if (limit !== undefined) {
    const conversations = await db
      .select()
      .from(conversationTable)
      .where(eq(conversationTable.userId, userId))
      .orderBy(desc(conversationTable.createdAt))
      .limit(limit);

    return conversations;
  }

  const conversations = await db
    .select()
    .from(conversationTable)
    .where(eq(conversationTable.userId, userId))
    .orderBy(desc(conversationTable.createdAt));

  return conversations;
}

export async function dbGetConversationById({
  conversationId,
  userId,
  assistantId,
}: {
  conversationId: string;
  userId: string;
  assistantId?: string;
}) {
  if (assistantId !== undefined) {
    const [assistantConversation] = await db
      .select()
      .from(conversationTable)
      .where(
        and(
          eq(conversationTable.id, conversationId),
          eq(conversationTable.userId, userId),
          eq(conversationTable.assistantId, assistantId),
        ),
      );

    return assistantConversation;
  }

  const [conversation] = await db
    .select()
    .from(conversationTable)
    .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)));

  return conversation;
}

export async function dbUpdateConversationTitle({
  conversationId,
  name,
  userId,
}: {
  conversationId: string;
  name: string;
  userId: string;
}) {
  const [updatedConversation] = await db
    .update(conversationTable)
    .set({ name })
    .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)))
    .returning();

  return updatedConversation;
}

export async function dbDeleteConversationById({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  await db.transaction(async (tx) => {
    await tx
      .delete(conversationMessageTable)
      .where(
        and(
          eq(conversationMessageTable.conversationId, conversationId),
          eq(conversationMessageTable.userId, userId),
        ),
      );

    await tx
      .delete(conversationTable)
      .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)));
  });
}

export async function dbDeleteAllConversationsByUserId({ userId }: { userId: string }) {
  await db.transaction(async (tx) => {
    await tx.delete(conversationMessageTable).where(eq(conversationMessageTable.userId, userId));
    await tx.delete(conversationTable).where(eq(conversationTable.userId, userId));
  });
}

export async function dbGetUserConversationsCount({ userId }: { userId: string }) {
  const [conversationsCount] = await db
    .select({ count: sql<number>`count(${conversationTable.id})` })
    .from(conversationTable)
    .where(eq(conversationTable.userId, userId));

  return conversationsCount?.count;
}

export async function dbGetUserConversationMessagesCount({ userId }: { userId: string }) {
  const [messagesCount] = await db
    .select({ count: sql<number>`count(${conversationMessageTable.id})` })
    .from(conversationMessageTable)
    .where(eq(conversationMessageTable.userId, userId));

  return messagesCount?.count;
}

export async function dbSearchConversationsByName({
  q,
  userId,
  limit = 50,
}: {
  q: string;
  userId: string;
  limit?: number;
}) {
  const pattern = `%${q}%`;

  const rows = await db
    .select()
    .from(conversationTable)
    .where(and(ilike(conversationTable.name, pattern), eq(conversationTable.userId, userId)))
    .orderBy(desc(conversationTable.updatedAt))
    .limit(limit);

  return rows;
}
