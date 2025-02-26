import { env } from '@/env';
import fetch from 'node-fetch';
import { z } from 'zod';

const responseSchema = z.object({
  query: z.object({
    original: z.string(),
    show_strict_warning: z.boolean(),
    is_navigational: z.boolean(),
    is_news_breaking: z.boolean(),
    spellcheck_off: z.boolean(),
    country: z.string(),
    bad_results: z.boolean(),
    should_fallback: z.boolean(),
    postal_code: z.string(),
    city: z.string(),
    header_country: z.string(),
    more_results_available: z.boolean(),
    state: z.string(),
  }),
  mixed: z.object({
    type: z.literal('mixed'),
    main: z.array(z.any()),
    top: z.array(z.any()),
    side: z.array(z.any()),
  }),
  type: z.literal('search'),
  videos: z.object({
    type: z.literal('videos'),
    results: z.array(z.any()),
    mutated_by_goggles: z.boolean(),
  }),
  web: z.object({
    type: z.literal('search'),
    results: z.array(z.any()),
    family_friendly: z.boolean(),
  }),
});

type BraveResponse = z.infer<typeof responseSchema>;

const braveApiKey = env.braveApiKey;

export async function braveSearch(searchQuery: string): Promise<BraveResponse> {
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
  const parsedResponse = responseSchema.safeParse(json);

  if (!parsedResponse.success) {
    throw new Error(`Brave Search API response error: ${parsedResponse.error.errors}`);
  }

  return parsedResponse.data;
}
