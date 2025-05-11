import { UICard } from '@/components/common/ui-card';
import {
  dbGetAllActiveDataSourcesByUserId,
  dbGetAllDataSourceIntegrations,
} from '@/db/functions/data-source-integrations';
import { getUser } from '@/utils/auth';
import { cw, uiCardClassName } from '@/utils/tailwind';
import { getTranslations } from 'next-intl/server';

import IntegrationCard from './integration-card';

export default async function Page() {
  const user = await getUser();
  const t = await getTranslations('settings.integrations');

  const allDataSourceIntegrations = await dbGetAllDataSourceIntegrations();
  const activeIntegrationsByUser = await dbGetAllActiveDataSourcesByUserId({ userId: user.id });

  const availableIntegrations = allDataSourceIntegrations.filter((i) => i.state === 'active');

  return (
    <>
      <UICard
        header={<h1 className="text-lg">{t('title')}</h1>}
        className={cw(uiCardClassName, 'pb-6')}
      >
        <div className="flex flex-col gap-4 mb-8">
          <p className="text-base">{t('description')}</p>
          <p className="text-sm text-secondary-foreground/70 dark:text-primary-foreground/60 italic">
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
