import { and, eq } from 'drizzle-orm';

import { db } from '..';
import {
  assistantTable,
  conversationMessageTable,
  conversationTable,
  vectorStoreTable,
  type AssistantRow,
  type InsertAssistantRow,
} from '../schema';

export async function dbGetAssistantsByUserId({
  userId,
}: {
  userId: string;
}): Promise<AssistantRow[]> {
  const assistants = await db
    .select()
    .from(assistantTable)
    .where(eq(assistantTable.userId, userId));

  return assistants;
}

export async function dbInsertAssistant(
  data: InsertAssistantRow,
): Promise<AssistantRow | undefined> {
  const assistant = (await db.insert(assistantTable).values(data).returning())[0];

  return assistant;
}

export async function dbGetAssistantById({
  assistantId,
  userId,
}: {
  assistantId: string;
  userId: string;
}): Promise<AssistantRow | undefined> {
  const assistant = (
    await db
      .select()
      .from(assistantTable)
      .where(and(eq(assistantTable.id, assistantId), eq(assistantTable.userId, userId)))
  )[0];

  return assistant;
}

export async function dbUpdateAssistant({
  assistantId,
  userId,
  data,
}: {
  assistantId: string;
  userId: string;
  data: Partial<AssistantRow>;
}): Promise<AssistantRow | undefined> {
  const assistant = (
    await db
      .update(assistantTable)
      .set(data)
      .where(and(eq(assistantTable.id, assistantId), eq(assistantTable.userId, userId)))
      .returning()
  )[0];

  return assistant;
}

export async function dbDeleteAssistant({
  assistantId,
  userId,
}: {
  assistantId: string;
  userId: string;
}): Promise<void> {
  await db.transaction(async (tx) => {
    const [assistant] = await tx
      .select()
      .from(assistantTable)
      .where(eq(assistantTable.id, assistantId));

    if (assistant === undefined) {
      throw new Error('Assistant not found');
    }

    const AssistantConversations = await tx
      .select()
      .from(conversationTable)
      .where(
        and(eq(conversationTable.assistantId, assistantId), eq(conversationTable.userId, userId)),
      );

    if (AssistantConversations.length > 0) {
      await Promise.all(
        AssistantConversations.map(async (conversation) => {
          await tx
            .delete(conversationMessageTable)
            .where(
              and(
                eq(conversationMessageTable.conversationId, conversation.id),
                eq(conversationMessageTable.userId, userId),
              ),
            );
        }),
      );
    }

    await tx
      .delete(conversationTable)
      .where(
        and(eq(conversationTable.assistantId, assistantId), eq(conversationTable.userId, userId)),
      );

    await tx
      .delete(assistantTable)
      .where(and(eq(assistantTable.id, assistantId), eq(assistantTable.userId, userId)));

    if (assistant.vectorStoreId !== null) {
      await tx
        .delete(vectorStoreTable)
        .where(
          and(
            eq(vectorStoreTable.id, assistant.vectorStoreId),
            eq(vectorStoreTable.userId, userId),
          ),
        );
    }
  });
}

export async function dbSetAssistantVectorStoreId({
  assistantId,
  userId,
  vectorStoreId,
}: {
  assistantId: string;
  userId: string;
  vectorStoreId: string;
}): Promise<AssistantRow | undefined> {
  const assistant = await db.transaction(async (tx) => {
    const [vectorStore] = await tx
      .insert(vectorStoreTable)
      .values({ id: vectorStoreId, name: `Assistant-${assistantId}-vector-store`, userId })
      .returning();

    if (vectorStore === undefined) {
      throw new Error('Failed to create vector store');
    }

    const [updatedAssistant] = await tx
      .update(assistantTable)
      .set({ vectorStoreId: vectorStore.id })
      .where(and(eq(assistantTable.id, assistantId), eq(assistantTable.userId, userId)))
      .returning();

    return updatedAssistant;
  });

  return assistant;
}
