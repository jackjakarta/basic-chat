import { cookies } from 'next/headers';

import { isDevMode } from './dev-mode';
import { type SiteLanguage } from './types';

export function getServerLanguagePreference(): SiteLanguage | undefined {
  return cookies().get('lang')?.value as SiteLanguage | undefined;
}

export function setCookie(
  name: string,
  value: string,
  options?: { maxAge?: number; path?: string },
) {
  const cookieOptions = {
    ...options,
    httpOnly: true,
    secure: !isDevMode,
    sameSite: 'strict' as 'strict' | 'lax' | 'none',
  };

  cookies().set({
    name,
    value,
    ...cookieOptions,
  });
}

export function deleteCookie(name: string) {
  cookies().delete(name);
}
