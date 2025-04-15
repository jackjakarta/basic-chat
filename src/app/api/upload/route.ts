import { dbAddFileIdsToVectorStore } from '@/db/functions/vector-store';
import { openai } from '@/openai';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(request: Request) {
  const user = await getUser();

  try {
    const formData = await request.formData();

    const fileField = formData.get('file');
    const vectorStoreId = formData.get('vectorStoreId');

    if (!fileField || !(fileField instanceof File)) {
      return NextResponse.json({ error: 'No file provided or invalid file type' }, { status: 400 });
    }

    const parsedVectorStoreId = z.string().safeParse(vectorStoreId);

    if (!parsedVectorStoreId.success) {
      return NextResponse.json({ error: 'Invalid vector store ID' }, { status: 400 });
    }

    const validVectorStoreId = parsedVectorStoreId.data;

    const file = await openai.files.create({
      file: fileField,
      purpose: 'user_data',
    });

    const fileId = file.id;

    const updatedVectorStore = await dbAddFileIdsToVectorStore({
      vectorStoreId: validVectorStoreId,
      userId: user.id,
      fileIds: [fileId],
    });

    if (updatedVectorStore === undefined) {
      return NextResponse.json({ error: 'Failed to update vector store' }, { status: 500 });
    }

    console.debug({
      vectorStoreId: updatedVectorStore.id,
      fileIds: updatedVectorStore.fileIds,
    });

    return NextResponse.json({ fileId, fileSize: fileField.size }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
