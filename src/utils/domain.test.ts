import { describe, expect, it } from 'vitest';

import { extractDomain } from './domain';

describe('extractDomain', () => {
  it('should extract the domain from a URL with "www"', () => {
    const url = 'https://www.example.com/some-path';
    const result = extractDomain(url);

    expect(result).toBe('example.com');
  });

  it('should extract the domain from a URL with a subdomain and a multi-level TLD', () => {
    const url = 'https://subdomain.example.co.uk/another-path';
    const result = extractDomain(url);

    expect(result).toBe('example.co.uk');
  });

  it('should return the simple domain when there is no subdomain', () => {
    const url = 'https://example.org';
    const result = extractDomain(url);

    expect(result).toBe('example.org');
  });

  it('should return an empty string for an invalid URL', () => {
    const invalidUrl = 'not-a-valid-url';

    const result = extractDomain(invalidUrl);
    expect(result).toBe('');
  });
});
