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
