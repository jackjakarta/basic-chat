'use server';

import { setCookie } from '@/utils/cookies';
import { siteLanguageSchema } from '@/utils/schemas';

export async function setLanguageCookie({ newLanguage }: { newLanguage: string }) {
  const parsedLanguage = siteLanguageSchema.safeParse(newLanguage);

  if (!parsedLanguage.success) {
    throw new Error('Invalid language');
  }

  setCookie('lang', parsedLanguage.data, { path: '/' });
}
