import { env } from '@/env';
import { tool } from 'ai';
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

export function getBarcaMatchesTool() {
  const getBarcaMatchesTool = tool({
    description: 'Get information for the FC Barcelona upcoming football matches.',
    parameters: z.object({}),
    execute: async () => {
      try {
        const matches = await getBarcaMatches();
        console.debug({ matches });

        if (matches.length === 0) {
          return 'An error occurred while getting the information.';
        }

        return matches;
      } catch (error) {
        const errorMessage = 'An error occurred while fetching match data. We are sorry.';

        if (error instanceof Error) {
          console.error({ error: error.message });
          throw new Error(errorMessage);
        }

        console.error({ error });
        throw new Error(errorMessage);
      }
    },
  });

  return getBarcaMatchesTool;
}

async function getBarcaMatches() {
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
