import { UICard } from '@/components/common/container-card';
import { cw, uiCardClassName } from '@/utils/tailwind';
import { getTranslations } from 'next-intl/server';

import SetLanguageSelect from './set-language-select';

export default async function Page() {
  const t = await getTranslations('settings.preferences');

  return (
    <>
      <UICard
        header={<h1 className="text-lg">{t('language.heading')}</h1>}
        // footer={<span>{t('description')}</span>}
        // footerClassName="text-sm text-muted-foreground/60"
        className={cw(uiCardClassName, 'pb-6')}
      >
        <SetLanguageSelect />
        <div className="mt-3">
          <span className="text-sm dark:text-muted-foreground/60">{t('description')}</span>
        </div>
      </UICard>
      <div className="mb-16" />
    </>
  );
}
