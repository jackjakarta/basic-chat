import Header from '@/components/common/header';
import LoadingPage from '@/components/common/loading-page';
import PageContainer from '@/components/common/page-container';
import { dbGetAssistantsByUserId } from '@/db/functions/assistant';
import { getUser } from '@/utils/auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import AssistantCard from './_components/assistant-card';
import CreateAssistantButton from './_components/create-assistant-button';

export default async function Page() {
  const user = await getUser();

  const [assistants, t] = await Promise.all([
    dbGetAssistantsByUserId({ userId: user.id }),
    getTranslations('assistants'),
  ]);

  return (
    <React.Suspense fallback={<LoadingPage />}>
      <Header />
      <PageContainer className="mx-auto">
        <div className="flex w-full flex-col gap-6">
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p>{t('description')}</p>
          <CreateAssistantButton className="w-fit rounded-lg bg-accent text-secondary-foreground hover:bg-accent/90 active:bg-accent/90" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {assistants.length === 0 ? (
              <span className="text-sm text-muted-foreground">{t('no-assistants')}</span>
            ) : (
              assistants.map((assistant) => (
                <AssistantCard key={assistant.id} assistant={assistant} />
              ))
            )}
          </div>
        </div>
      </PageContainer>
    </React.Suspense>
  );
}
