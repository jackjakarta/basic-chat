import { env } from '@/env';
import fetch from 'node-fetch';

const braveApiKey = env.braveApiKey;

export async function braveSearch(searchQuery: string) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': braveApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  return json;
}
