import { type TokenAction } from '@/db/schema';

import { getBaseUrlByHeaders } from './host';

export function buildRouteUrl({ route }: { route: string }) {
  return `${getBaseUrlByHeaders()}/${route}`;
}

export function buildUserActionUrl({
  searchParams,
  tokenAction,
}: {
  searchParams: URLSearchParams;
  tokenAction: TokenAction;
}) {
  const routeUrl = buildRouteUrl({ route: tokenAction });
  const userActionUrl = `${routeUrl}?${searchParams.toString()}`;

  return userActionUrl;
}

export function extractFileNameFromUrl(url: string | null): string | null {
  if (url === null) {
    return null;
  }

  const match = url.match(/[^/]+$/);

  return match ? match[0] : null;
}
