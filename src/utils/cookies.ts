import { cookies } from 'next/headers';

import { type AppLocale } from '../types/utils';
import { isDevMode } from './dev-mode';
import { appLocaleSchema } from './schemas';

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

export function getCookieValue(name: string): string | undefined {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(name)?.value;

  return cookieValue;
}

export function getServerLanguagePreference(): AppLocale | undefined {
  const locale = getCookieValue('site_language');
  const parsedLocale = appLocaleSchema.safeParse(locale);

  if (!parsedLocale.success) {
    return undefined;
  }

  return parsedLocale.data;
}

export function getSidebarOpenStateFromCookies(): boolean {
  const sidebarState = getCookieValue('sidebar_state');
  const isSidebarOpen = sidebarState !== undefined ? sidebarState === 'true' : true;

  return isSidebarOpen;
}
