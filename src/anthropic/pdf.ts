import { anthropic } from '.';

export async function extractTextFromPdf({ pdfUrl }: { pdfUrl: string }) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'url',
              url: pdfUrl,
            },
          },
          {
            type: 'text',
            text: 'Extract the text from this PDF document.',
          },
        ],
      },
    ],
  });

  const extractedText = response.content[0]?.type === 'text' ? response.content[0].text : undefined;

  return extractedText;
}
