import { addFileIdsToVectorStore } from '@/openai/files';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  vectorStoreId: z.string(),
  fileIds: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const body = requestSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: body.error.format() },
        { status: 400 },
      );
    }

    const { vectorStoreId, fileIds } = body.data;

    const result = await addFileIdsToVectorStore({
      vectorStoreId,
      fileIds,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
