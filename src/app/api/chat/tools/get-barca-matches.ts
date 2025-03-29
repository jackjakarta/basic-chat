import { env } from '@/env';
import { z } from 'zod';

const url = env.utilsApiUrl;
const apiKey = env.utilsApiKey;

const matchSchema = z.object({
  date: z.string(),
  title: z.string(),
});

const apiResponseSchema = z.object({
  matches: z.array(matchSchema),
});

export async function getBarcaMatches() {
  console.debug({ url, apiKey });
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const parsed = apiResponseSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(`Invalid response from Brave Search API: ${parsed.error}`);
  }

  const { matches } = parsed.data;

  return matches;
}
