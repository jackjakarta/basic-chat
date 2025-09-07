import { env } from '@/env';
import { tool } from 'ai';
import { z } from 'zod';

import { getToolResultSchema, type ToolError } from './types';

const url = env.utilsApiUrl;
const apiKey = env.utilsApiKey;

const matchSchema = z.object({
  date: z.string(),
  title: z.string(),
});

const apiResponseSchema = z.object({
  matches: z.array(matchSchema),
});

export const barcaMatchesToolResultSchema = getToolResultSchema(matchSchema);

export type BarcaMatch = z.infer<typeof matchSchema>;
export type BarcaMatchesToolResult = z.infer<typeof barcaMatchesToolResultSchema>;
export type BarcaMatchesToolResponse = BarcaMatchesToolResult | ToolError;

export function getBarcaMatchesTool() {
  const getBarcaMatchesTool = tool({
    description: 'Get information for the FC Barcelona upcoming football matches.',
    parameters: z.object({}),
    execute: async (): Promise<BarcaMatchesToolResponse> => {
      try {
        const matches = await getBarcaMatches();
        console.info({ matches });

        if (matches.length === 0) {
          return {
            success: false,
            error: 'An error occurred while getting the information.',
          };
        }

        return {
          success: true,
          result: matches,
        };
      } catch {
        return {
          success: false,
          error: 'An error occurred while fetching match data. We are sorry.',
        };
      }
    },
  });

  return getBarcaMatchesTool;
}

async function getBarcaMatches(): Promise<BarcaMatch[]> {
  const fullUrl = `${url}/scrape`;

  const response = await fetch(fullUrl, {
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
