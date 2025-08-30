import { extractTextFromPdf } from '@/anthropic/pdf';
import { dbInsertEmbedding, dbInsertFile } from '@/db/functions/file';
import { dbGetFolderById } from '@/db/functions/folder';
import { getTextEmbedding } from '@/openai/embed';
import { deleteFileFromS3, getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { getUser } from '@/utils/auth';
import { getFileExtension } from '@/utils/files';
import { cnanoid } from '@/utils/random';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 2;
const SUPPORTED_FILE_EXTENSIONS = ['pdf'];

export async function POST(req: NextRequest) {
  const user = await getUser();

  const formData = await req.formData();

  const folderId = formData.get('folderId');
  const file = formData.get('file');

  const parsedFolderId = z.string().uuid().safeParse(folderId);

  if (!parsedFolderId.success) {
    return NextResponse.json({ error: 'Invalid folder ID' }, { status: 400 });
  }

  if (file === null) {
    return NextResponse.json({ error: 'Could not find file in form data' }, { status: 400 });
  }

  if (typeof file === 'string') {
    return NextResponse.json(
      { error: 'file FormData entry value was of type "string", but expected type "File"' },
      { status: 400 },
    );
  }

  const validFolderId = parsedFolderId.data;
  const folder = await dbGetFolderById({
    folderId: validFolderId,
    userId: user.id,
  });

  if (folder === undefined) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
  }

  const fileExtension = getFileExtension(file.name);

  if (!SUPPORTED_FILE_EXTENSIONS.includes(fileExtension.toLowerCase())) {
    return NextResponse.json(
      { error: `Extension ${fileExtension} is not supported` },
      { status: 420 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File size exceeds the limit of ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB` },
      { status: 413 },
    );
  }

  const keyPrefix = cnanoid(12);
  const key = `${user.email}/uploaded/files/${keyPrefix}_${file.name}`;

  try {
    const s3Result = await uploadFileToS3({
      key,
      fileBuffer: await file.arrayBuffer(),
      contentType: file.type,
    });

    if (s3Result.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: 'Failed to upload file to S3' }, { status: 500 });
    }

    const newFile = await dbInsertFile({
      userId: user.id,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      folderId: folder.id,
      s3BucketKey: key,
    });

    if (newFile === undefined) {
      await deleteFileFromS3({ key });
      return NextResponse.json({ error: 'Failed to record file in database' }, { status: 500 });
    }

    const signedUrl = await getSignedUrlFromS3Get({
      key,
      contentType: newFile.mimeType,
      filename: newFile.name,
      attachment: false,
    });

    const extractedText = await extractTextFromPdf({ pdfUrl: signedUrl });

    if (extractedText === undefined) {
      return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
    }

    const embedding = await getTextEmbedding({ input: extractedText });

    if (embedding === undefined) {
      return NextResponse.json({ error: 'Failed to create text embedding' }, { status: 500 });
    }

    const embeddingRow = await dbInsertEmbedding({
      fileId: newFile.id,
      content: extractedText,
      embedding,
    });

    if (embeddingRow === undefined) {
      return NextResponse.json(
        { error: 'Failed to record embedding in database' },
        { status: 500 },
      );
    }

    return NextResponse.json({ fileId: key, signedUrl }, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
