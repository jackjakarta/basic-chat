import Header from '@/components/common/header';
import LoadingPage from '@/components/common/loading-page';
import PageContainer from '@/components/common/page-container';
import { dbGetFoldersByUserId } from '@/db/functions/folder';
import { getUser } from '@/utils/auth';
import { getTranslations } from 'next-intl/server';
import React from 'react';

import { FolderCard } from './folder-card';

export default async function Page() {
  const user = await getUser();

  const [folders, t] = await Promise.all([
    dbGetFoldersByUserId({ userId: user.id }),
    getTranslations('assistants'),
  ]);

  return (
    <React.Suspense fallback={<LoadingPage />}>
      <Header />
      <PageContainer className="mx-auto">
        <div className="flex w-full flex-col gap-6">
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p>{t('description')}</p>
          {/* <CreateAssistantButton className="w-fit rounded-lg bg-accent text-secondary-foreground hover:bg-accent/90 active:bg-accent/90" /> */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {folders.length === 0 ? (
              <span className="text-sm text-muted-foreground">{t('no-assistants')}</span>
            ) : (
              folders.map((folder) => <FolderCard key={folder.id} folder={folder} />)
            )}
          </div>
        </div>
      </PageContainer>
    </React.Suspense>
  );
}
