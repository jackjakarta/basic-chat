'use server';

import { dbDeleteAgent, dbUpdateAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
import { getUser } from '@/utils/auth';

export async function deleteAgentAction({ agentId }: { agentId: string }) {
  const user = await getUser();
  await dbDeleteAgent({ agentId, userId: user.id });
}

export async function updateAgentAction({
  agentId,
  data,
}: {
  agentId: string;
  data: Partial<AgentRow>;
}) {
  const user = await getUser();
  const updatedAgent = await dbUpdateAgent({ agentId, userId: user.id, data });

  if (updatedAgent === undefined) {
    throw new Error('Failed to update agent');
  }

  return updatedAgent;
}
