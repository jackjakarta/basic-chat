import { getServerLanguagePreference } from '@/utils/cookies';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = getServerLanguagePreference() ?? 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
