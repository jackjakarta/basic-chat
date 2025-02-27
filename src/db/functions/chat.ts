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
  agentId,
}: {
  conversationId: string;
  userId: string;
  agentId?: string;
}) {
  return (
    await db
      .insert(conversationTable)
      .values({ id: conversationId, name: 'New Chat', userId, agentId })
      .onConflictDoUpdate({
        target: conversationTable.id,
        set: { id: conversationId },
      })
      .returning()
  )[0];
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
  return (await db.insert(conversationMessageTable).values(chatContent).returning())[0];
}

export async function dbGetConversations({ userId }: { userId: string }) {
  return db
    .select()
    .from(conversationTable)
    .where(eq(conversationTable.userId, userId))
    .orderBy(desc(conversationTable.createdAt));
}

export async function dbGetConversationById({
  conversationId,
  userId,
  agentId,
}: {
  conversationId: string;
  userId: string;
  agentId?: string;
}) {
  if (agentId) {
    return (
      await db
        .select()
        .from(conversationTable)
        .where(
          and(
            eq(conversationTable.id, conversationId),
            eq(conversationTable.userId, userId),
            eq(conversationTable.agentId, agentId),
          ),
        )
    )[0];
  }

  return (
    await db
      .select()
      .from(conversationTable)
      .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)))
  )[0];
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
  return (
    await db
      .update(conversationTable)
      .set({ name })
      .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)))
      .returning()
  )[0];
}

export async function dbUpdateConversationMessageContent(
  conversationMessageId: string,
  conversationMessageContent: string,
) {
  await db
    .update(conversationMessageTable)
    .set({ content: conversationMessageContent })
    .where(eq(conversationMessageTable.id, conversationMessageId));
}

export async function dbDeleteConversationById({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  await db.transaction(async (trx) => {
    await trx
      .delete(conversationMessageTable)
      .where(
        and(
          eq(conversationMessageTable.conversationId, conversationId),
          eq(conversationMessageTable.userId, userId),
        ),
      );

    await trx
      .delete(conversationTable)
      .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)));
  });
}
