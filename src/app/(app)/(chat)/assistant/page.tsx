import Header from '@/components/common/header';
import PageContainer from '@/components/common/page-container';
import { dbGetAssistantsByUserId } from '@/db/functions/assistant';
import { getUser } from '@/utils/auth';
import { getTranslations } from 'next-intl/server';

import AssistantCard from './_components/assistant-card';
import CreateAssistantButton from './_components/create-assistant-button';

export default async function Page() {
  const user = await getUser();

  const [assistants, t] = await Promise.all([
    dbGetAssistantsByUserId({ userId: user.id }),
    getTranslations('agents'),
  ]);

  return (
    <>
      <Header />
      <PageContainer className="mx-auto">
        <div className="flex flex-col gap-6 w-full">
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p>{t('description')}</p>
          <CreateAssistantButton className="w-fit rounded-lg bg-accent hover:bg-accent/90 text-secondary-foreground active:bg-accent/90" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assistants.length === 0 ? (
              <span className="text-sm text-muted-foreground">{t('no-agents')}</span>
            ) : (
              assistants.map((assistant) => (
                <AssistantCard key={assistant.id} assistant={assistant} />
              ))
            )}
          </div>
        </div>
      </PageContainer>
    </>
  );
}
