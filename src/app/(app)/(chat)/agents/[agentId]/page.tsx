import PageContainer from '@/components/common/page-container';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

const pageContextSchema = z.object({
  params: z.object({
    agentId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const agentId = parsedParams.data.params.agentId;

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col">
        <h1>Agents Page - {agentId}</h1>
      </div>
    </PageContainer>
  );
}
