import { headers as getHeaders } from 'next/headers';

export function getHostByHeaders() {
  const headers = getHeaders();
  const host = headers.get('host');

  if (host === null) {
    throw new Error('Host header not found');
  }

  return host;
}

export function getBaseUrlByHeaders() {
  const host = getHostByHeaders();
  const isLocalhost = host === 'localhost:3000' || host === '127.0.0.1:3000';

  const prefix = isLocalhost ? 'http' : 'https';
  const baseUrl = `${prefix}://${host}`;

  return baseUrl;
}

export function checkIsLocalhost() {
  const host = getHostByHeaders();

  return host === 'localhost:3000' || host === '127.0.0.1:3000';
}
