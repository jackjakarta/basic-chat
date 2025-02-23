import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { agentTable, type AgentRow, type InsertAgentRow } from '../schema';

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
