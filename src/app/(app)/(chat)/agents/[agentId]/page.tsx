import PageContainer from '@/components/common/page-container';
import { dbGetAgentById } from '@/db/functions/agent';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import EditAgentForm from '../_components/edit-agent-form';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const agentId = parsedParams.data.params.agentId;
  const agent = await dbGetAgentById({ agentId, userId: user.id });

  if (agent === undefined) {
    return notFound();
  }

  return (
    <PageContainer className="mx-auto w-full">
      <EditAgentForm agent={agent} />
    </PageContainer>
  );
}
