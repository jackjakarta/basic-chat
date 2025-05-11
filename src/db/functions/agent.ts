import { and, eq } from 'drizzle-orm';

import { db } from '..';
import {
  agentTable,
  conversationMessageTable,
  conversationTable,
  vectorStoreTable,
  type AgentRow,
  type InsertAgentRow,
} from '../schema';

export async function dbGetAgentsByUserId({ userId }: { userId: string }): Promise<AgentRow[]> {
  const agents = await db.select().from(agentTable).where(eq(agentTable.userId, userId));

  return agents;
}

export async function dbInsertAgent(data: InsertAgentRow): Promise<AgentRow | undefined> {
  const agent = (await db.insert(agentTable).values(data).returning())[0];

  return agent;
}

export async function dbGetAgentById({
  agentId,
  userId,
}: {
  agentId: string;
  userId: string;
}): Promise<AgentRow | undefined> {
  const agent = (
    await db
      .select()
      .from(agentTable)
      .where(and(eq(agentTable.id, agentId), eq(agentTable.userId, userId)))
  )[0];

  return agent;
}

export async function dbUpdateAgent({
  agentId,
  userId,
  data,
}: {
  agentId: string;
  userId: string;
  data: Partial<AgentRow>;
}): Promise<AgentRow | undefined> {
  const agent = (
    await db
      .update(agentTable)
      .set(data)
      .where(and(eq(agentTable.id, agentId), eq(agentTable.userId, userId)))
      .returning()
  )[0];

  return agent;
}

export async function dbDeleteAgent({
  agentId,
  userId,
}: {
  agentId: string;
  userId: string;
}): Promise<void> {
  await db.transaction(async (tx) => {
    const [agent] = await tx.select().from(agentTable).where(eq(agentTable.id, agentId));

    if (agent === undefined) {
      throw new Error('Agent not found');
    }

    const agentConversations = await tx
      .select()
      .from(conversationTable)
      .where(and(eq(conversationTable.agentId, agentId), eq(conversationTable.userId, userId)));

    if (agentConversations.length > 0) {
      await Promise.all(
        agentConversations.map(async (conversation) => {
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
      .where(and(eq(conversationTable.agentId, agentId), eq(conversationTable.userId, userId)));

    await tx
      .delete(agentTable)
      .where(and(eq(agentTable.id, agentId), eq(agentTable.userId, userId)));

    if (agent.vectorStoreId !== null) {
      await tx
        .delete(vectorStoreTable)
        .where(
          and(eq(vectorStoreTable.id, agent.vectorStoreId), eq(vectorStoreTable.userId, userId)),
        );
    }
  });
}

export async function dbSetAgentVectorStoreId({
  agentId,
  userId,
  vectorStoreId,
}: {
  agentId: string;
  userId: string;
  vectorStoreId: string;
}): Promise<AgentRow | undefined> {
  const agent = await db.transaction(async (tx) => {
    const [vectorStore] = await tx
      .insert(vectorStoreTable)
      .values({ id: vectorStoreId, name: `agent-${agentId}-vector-store`, userId })
      .returning();

    if (vectorStore === undefined) {
      throw new Error('Failed to create vector store');
    }

    const [updatedAgent] = await tx
      .update(agentTable)
      .set({ vectorStoreId: vectorStore.id })
      .where(and(eq(agentTable.id, agentId), eq(agentTable.userId, userId)))
      .returning();

    return updatedAgent;
  });

  return agent;
}
