import { headers } from 'next/headers';

export function getHostByHeaders() {
  const hostHeaders = headers();
  const host = hostHeaders.get('host');

  if (host === null) {
    throw new Error('Host header not found');
  }

  return host;
}

export function getBaseUrlByHeaders() {
  const host = getHostByHeaders();
  const formatedPrefix = host === '127.0.0.1:3000' || host === 'localhost:3000' ? 'http' : 'https';
  const baseUrl = `${formatedPrefix}://${host}`;

  return baseUrl;
}

function checkIsLocalhost() {
  const host = getHostByHeaders();

  return host === 'localhost:3000' || host === '127.0.0.1:3000';
}

export const isLocalhost = checkIsLocalhost();
