import { and, eq } from 'drizzle-orm';

import { db } from '..';
import {
  agentTable,
  conversationMessageTable,
  conversationTable,
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
  });
}
