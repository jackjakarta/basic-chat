'use server';

import { setCookie } from '@/utils/cookies';
import { appLocaleSchema } from '@/utils/schemas';
import { revalidatePath } from 'next/cache';

export async function setLanguageCookieAction({ newLanguage }: { newLanguage: string }) {
  const parsedLanguage = appLocaleSchema.safeParse(newLanguage);

  if (!parsedLanguage.success) {
    throw new Error('Invalid language');
  }

  setCookie('site_language', parsedLanguage.data, { path: '/' });
  revalidatePath('/');
}
