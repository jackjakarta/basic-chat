import crypto from 'node:crypto';

import { fileEmbeddingTable, type InsertFileEmbeddingRow } from '@/db/schema';
import { getEmbedding } from '@/openai/embed';
import { eq, max } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db';

const CHARS_PER_CHUNK = 3200;
const CHUNK_OVERLAP_CHARS = 320;

export const extractPdfResponseSchema = z.array(
  z.object({
    page: z.number(),
    text: z.string(),
  }),
);

export type ExtractPdfPage = z.infer<typeof extractPdfResponseSchema>[number];

type IngestOptions = {
  fileId: string;
  pages: ExtractPdfPage[];
};

export async function ingestPdf({ fileId, pages }: IngestOptions) {
  const parsedPages = extractPdfResponseSchema
    .parse(pages)
    .map((p) => ({ page: p.page, text: clean(p.text ?? '') }))
    .filter((p) => p.text.length > 0)
    .sort((a, b) => a.page - b.page);

  let globalChunkIndex = await nextChunkIndex(fileId);
  const rows: InsertFileEmbeddingRow[] = [];

  for (const p of parsedPages) {
    const pageNumber = Math.max(1, Math.floor(p.page) || 1);
    const chunks = chunkBySize(p.text, CHARS_PER_CHUNK, CHUNK_OVERLAP_CHARS);

    for (const c of chunks) {
      const chunkText = c.text.trim();
      if (!chunkText) continue;

      const [embedding] = await Promise.all([getEmbedding({ input: chunkText })]);

      const contentHash = sha256(chunkText);

      rows.push({
        fileId,
        chunkText,
        chunkIndex: globalChunkIndex++,
        pageNumber,
        embedding: embedding ?? [],
        tokenCount: c.tokenCount,
        contentHash,
      });
    }
  }

  if (rows.length > 0) {
    await db.insert(fileEmbeddingTable).values(rows);
  }

  return { inserted: rows.length };
}

export async function extractTextFromPdf(pdfFile: File) {
  const formData = new FormData();
  formData.append('file', pdfFile);

  const response = await fetch('https://api.jackjakarta.xyz/api/v1/extract-pdf', {
    method: 'POST',
    headers: {
      Authorization: `Bearer VeBH1tl44p_jPmvSLqiXJbHItpV28Cxgx3KOPYOU4b`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`PDF.co API error: ${response.statusText}`);
  }

  const json = await response.json();
  const data = extractPdfResponseSchema.safeParse(json);

  if (!data.success) {
    throw new Error('Invalid response from PDF.co API');
  }

  const extracted = data.data;

  return extracted;
}

function chunkBySize(
  text: string,
  size = CHARS_PER_CHUNK,
  overlap = CHUNK_OVERLAP_CHARS,
): { text: string; tokenCount: number }[] {
  const chunks: { text: string; tokenCount: number }[] = [];
  if (!text) return chunks;

  const step = Math.max(1, size - overlap);

  for (let start = 0; start < text.length; start += step) {
    const end = Math.min(start + size, text.length);
    const chunkText = text.slice(start, end);
    const tokenCount = Math.max(1, Math.ceil(chunkText.length / 4));

    chunks.push({ text: chunkText, tokenCount });
    if (end === text.length) break;
  }

  return chunks;
}

function clean(text: string): string {
  return (
    text
      // eslint-disable-next-line no-control-regex
      .replace(/\u0000/g, '')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

async function nextChunkIndex(fileId: string): Promise<number> {
  const res = await db
    .select({ maxIdx: max(fileEmbeddingTable.chunkIndex) })
    .from(fileEmbeddingTable)
    .where(eq(fileEmbeddingTable.fileId, fileId));

  const maxIdx = res?.[0]?.maxIdx ?? null;

  return maxIdx === null ? 0 : Number(maxIdx) + 1;
}
