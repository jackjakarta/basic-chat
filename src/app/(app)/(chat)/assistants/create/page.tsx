import Header from '@/components/common/header';
import PageContainer from '@/components/common/page-container';
import { getTranslations } from 'next-intl/server';

import CreateAssistantForm from './create-assistant-form';

export default async function Page() {
  const t = await getTranslations('assistants.buttons');

  return (
    <>
      <Header />
      <PageContainer className="mx-auto w-full">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium">{t('create-assistant')}</h1>
          <CreateAssistantForm />
        </div>
      </PageContainer>
    </>
  );
}
