import Chat from '@/components/chat/chat';
import { dbGetAgentById } from '@/db/functions/agent';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);
  const id = generateUUID();

  if (!parsedParams.success) {
    return notFound();
  }

  const agentId = parsedParams.data.params.agentId;

  const [agent, models] = await Promise.all([
    dbGetAgentById({ agentId, userId: user.id }),
    dbGetEnabledModels(),
  ]);

  if (agent === undefined) {
    return notFound();
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      agentId={agent.id}
      agentName={agent.name}
      models={models}
      userFirstName={user.firstName}
    />
  );
}
