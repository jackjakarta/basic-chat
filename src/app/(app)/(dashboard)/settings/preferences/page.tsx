import { UICard } from '@/components/common/ui-card';
import { cw, uiCardClassName } from '@/utils/tailwind';
import { getLocale, getTranslations } from 'next-intl/server';

import LanguageSelect from './set-language-select';

export default async function Page() {
  const [t, locale] = await Promise.all([getTranslations('settings.preferences'), getLocale()]);

  return (
    <>
      <UICard
        header={<h1 className="text-lg">{t('language.heading')}</h1>}
        className={cw(uiCardClassName, 'pb-6')}
      >
        <LanguageSelect currentLocale={locale} />
        <div className="mt-3">
          <span className="text-sm dark:text-muted-foreground/60">{t('description')}</span>
        </div>
      </UICard>
      <div className="mb-16" />
    </>
  );
}
