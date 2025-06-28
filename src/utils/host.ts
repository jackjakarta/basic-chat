import { headers as nextHeaders } from 'next/headers';

export function getHostByHeaders() {
  const headers = nextHeaders();
  const host = headers.get('host');

  if (host === null) {
    throw new Error('Host header not found');
  }

  return host;
}

export function getBaseUrlByHeaders() {
  const host = getHostByHeaders();
  const isLocalhost = checkIsLocalhost();

  const formatedPrefix = isLocalhost ? 'http' : 'https';
  const baseUrl = `${formatedPrefix}://${host}`;

  return baseUrl;
}

export function checkIsLocalhost() {
  const host = getHostByHeaders();

  return host === 'localhost:3000' || host === '127.0.0.1:3000';
}
