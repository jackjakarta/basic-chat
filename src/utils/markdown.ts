/**
 * Turn the raw API code string into a nicely fenced
 * markdown code block that <MarkdownDisplay> can render.
 *
 * @param raw        The raw `codeResult` string.
 * @param language   (optional) Language tag for the fence; defaults to "python".
 * @returns          Clean markdown string, e.g. ```python … ```
 */
export function codeResultToMarkdown(raw: string, language: string = 'python'): string {
  if (raw.trim().length === 0) return '';

  const deChunked = raw
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*'/, '')
        .replace(/'\s*\+\s*$/, '')
        .replace(/'\s*$/, ''),
    )
    .join('\n');

  const withRealBreaks = deChunked.replace(/\\r?\\n/g, '\n');
  const cleaned = withRealBreaks.trimEnd().replace(/```/g, '``\\`');

  return `\`\`\`${language}\n${cleaned}\n\`\`\``;
}
