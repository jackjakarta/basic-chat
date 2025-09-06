export function extractFileNameFromSignedUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  try {
    const parsedUrl = new URL(url);
    const contentDisposition = parsedUrl.searchParams.get('response-content-disposition');

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        return match[1];
      }
    }

    const pathSegments = parsedUrl.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1] ?? '';
    const decoded = decodeURIComponent(lastSegment);
    // eslint-disable-next-line no-useless-escape
    const fileMatch = decoded.match(/([^\/\?]+\.pdf)$/i);

    return fileMatch !== null ? fileMatch[1] : undefined;
  } catch (e) {
    console.error('Invalid URL:', e);
    return undefined;
  }
}

export function buildConversationPath({
  chatProjectId,
  assistantId,
  chatId,
}: {
  chatProjectId?: string;
  assistantId?: string;
  chatId: string;
}) {
  if (assistantId !== undefined) {
    return `/assistants/${assistantId}/c/${chatId}`;
  }

  if (chatProjectId !== undefined) {
    return `/p/${chatProjectId}/c/${chatId}`;
  }

  return `/c/${chatId}`;
}
