import { getBaseUrlByHeaders } from './host';

export function buildRouteUrl({ route }: { route: string }) {
  return `${getBaseUrlByHeaders()}/${route}`;
}

export function buildUserActionUrl({ searchParams }: { searchParams: URLSearchParams }) {
  const routeUrl = buildRouteUrl({ route: 'user-action' });
  const userActionUrl = `${routeUrl}?${searchParams.toString()}`;

  return userActionUrl;
}
