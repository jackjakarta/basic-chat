import Header from '@/components/common/header';
import PageContainer from '@/components/common/page-container';
import { dbGetAssistantById } from '@/db/functions/assistant';
import { dbGetFilesFromVectorStore } from '@/db/functions/vector-store';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import EditAssistantForm from '../_components/update-assistant-form';

const pageContextSchema = z.object({
  params: z.object({
    assistantId: z.string().uuid(),
  }),
});

export default async function Page(context: unknown) {
  const user = await getUser();
  const parsedParams = pageContextSchema.safeParse(context);

  if (!parsedParams.success) {
    return notFound();
  }

  const { assistantId } = parsedParams.data.params;
  const assistant = await dbGetAssistantById({ assistantId, userId: user.id });

  if (assistant === undefined) {
    return notFound();
  }

  const assistantKnowledgeFiles = await dbGetFilesFromVectorStore({
    vectorStoreId: assistant.vectorStoreId ?? '',
    userId: user.id,
  });

  return (
    <>
      <Header />
      <PageContainer className="mx-auto w-full">
        <EditAssistantForm assistant={assistant} assistantFiles={assistantKnowledgeFiles?.files} />
      </PageContainer>
    </>
  );
}
