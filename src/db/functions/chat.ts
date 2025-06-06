import { and, desc, eq } from 'drizzle-orm';

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
}: {
  conversationId: string;
  userId: string;
  assistantId?: string;
}) {
  const conversation = await db
    .insert(conversationTable)
    .values({ id: conversationId, name: 'New Chat', userId, assistantId })
    .onConflictDoUpdate({
      target: conversationTable.id,
      set: { id: conversationId },
    })
    .returning();

  return conversation[0];
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

export async function dbGetConversations({ userId }: { userId: string }) {
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

export async function dbUpdateConversationMessageContent(
  conversationMessageId: string,
  conversationMessageContent: string,
) {
  const updatedConversationMessage = await db
    .update(conversationMessageTable)
    .set({ content: conversationMessageContent })
    .where(eq(conversationMessageTable.id, conversationMessageId))
    .returning();

  return updatedConversationMessage[0];
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
