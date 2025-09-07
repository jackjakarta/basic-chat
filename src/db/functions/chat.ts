import { type LanguageModelUsage } from 'ai';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';

import { db } from '..';
import {
  conversationMessageTable,
  conversationTable,
  conversationUsageTrackingTable,
  type InsertConversationMessageRow,
  type UpdateConversationRow,
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

export async function dbInsertChatContentWithUsage({
  chatContent,
  usage,
}: {
  chatContent: InsertConversationMessageRow;
  usage?: LanguageModelUsage;
}) {
  const _chatContent = await db.transaction(async (tx) => {
    const [newChatContent] = await tx
      .insert(conversationMessageTable)
      .values(chatContent)
      .returning();

    if (newChatContent !== undefined && newChatContent.userId !== null && usage !== undefined) {
      await tx
        .insert(conversationUsageTrackingTable)
        .values({
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          userId: newChatContent.userId,
          conversationId: newChatContent.conversationId,
          modelId: newChatContent.metadata?.modelId ?? '',
        })
        .returning();
    }

    return newChatContent;
  });

  return _chatContent;
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
  chatProjectId,
}: {
  conversationId: string;
  userId: string;
  assistantId?: string;
  chatProjectId?: string;
}) {
  if (chatProjectId !== undefined) {
    const [chatProjectConversation] = await db
      .select()
      .from(conversationTable)
      .where(
        and(
          eq(conversationTable.id, conversationId),
          eq(conversationTable.userId, userId),
          eq(conversationTable.chatProjectId, chatProjectId),
        ),
      );

    return chatProjectConversation;
  }

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

export async function dbUpdateConversation({
  conversationId,
  userId,
  data,
}: {
  conversationId: string;
  userId: string;
  data: UpdateConversationRow;
}) {
  const [updatedConversation] = await db
    .update(conversationTable)
    .set(data)
    .where(and(eq(conversationTable.id, conversationId), eq(conversationTable.userId, userId)))
    .returning();

  return updatedConversation;
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
