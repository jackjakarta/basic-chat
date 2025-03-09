import { cookies } from 'next/headers';

import { type SiteLanguage } from './types';

export function getServerLanguagePreference(): SiteLanguage | undefined {
  return cookies().get('lang')?.value as SiteLanguage | undefined;
}
