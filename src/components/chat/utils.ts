export function toolNameMap(inputString: string | undefined): string | undefined {
  if (inputString === undefined) {
    return undefined;
  }

  const mapping: Record<string, string> = {
    searchTheWeb: 'Searching the web...',
    generateImage: 'Generating image...',
    getBarcaMatches: 'Getting FC Barcelona matches...',
  };

  return mapping[inputString] ?? inputString;
}
