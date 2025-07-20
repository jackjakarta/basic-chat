import { UICard } from '@/components/common/ui-card';
import {
  dbGetAllActiveDataSourcesByUserId,
  dbGetAllDataSourceIntegrations,
} from '@/db/functions/data-source-integrations';
import { getUser } from '@/utils/auth';
import { cw, uiCardClassName } from '@/utils/tailwind';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import IntegrationCard from './integration-card';

export default async function Page() {
  const user = await getUser();

  if (user.subscription === 'free') {
    redirect('/billing');
  }

  const [t, allDataSourceIntegrations, activeIntegrationsByUser] = await Promise.all([
    getTranslations('settings.integrations'),
    dbGetAllDataSourceIntegrations(),
    dbGetAllActiveDataSourcesByUserId({ userId: user.id }),
  ]);

  const availableIntegrations = allDataSourceIntegrations.filter((i) => i.state === 'active');

  return (
    <>
      <UICard
        header={<h1 className="text-lg">{t('title')}</h1>}
        className={cw(uiCardClassName, 'pb-6')}
      >
        <div className="mb-8 flex flex-col gap-4">
          <p className="text-base">{t('description')}</p>
          <p className="text-sm italic text-secondary-foreground/70 dark:text-primary-foreground/60">
            {t('privacy-disclaimer')}
          </p>
        </div>

        {availableIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            activeIntegration={activeIntegrationsByUser.find((i) => i.id === integration.id)}
            {...integration}
          />
        ))}
      </UICard>
      <div className="mb-16" />
    </>
  );
}
