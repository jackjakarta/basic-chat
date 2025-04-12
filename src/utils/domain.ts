import { parse } from 'psl';

export function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parsed = parse(hostname);
    if (parsed && !parsed.error && typeof parsed.domain === 'string') {
      return parsed.domain;
    }
    return hostname;
  } catch {
    return '';
  }
}
