import { dbGetChatProjectById } from '@/db/functions/chat-project';
import { dbInsertFile } from '@/db/functions/file';
import { deleteFileFromS3, getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { getUser } from '@/utils/auth';
import { getFileExtension } from '@/utils/files';
import { extractTextFromPdf, ingestPdf } from '@/utils/pdf';
import { cnanoid } from '@/utils/random';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 2;
const SUPPORTED_FILE_EXTENSIONS = ['pdf'];

export async function POST(req: NextRequest) {
  const user = await getUser();

  const formData = await req.formData();
  const file = formData.get('file');
  const chatProjectId = formData.get('chatProjectId');

  if (file === null) {
    return NextResponse.json({ error: 'Could not find file in form data' }, { status: 400 });
  }

  if (typeof file === 'string') {
    return NextResponse.json(
      { error: 'file FormData entry value was of type "string", but expected type "File"' },
      { status: 400 },
    );
  }

  const maybeChatProjectId = z.string().optional().parse(chatProjectId);

  if (maybeChatProjectId !== undefined) {
    const chatProject = await dbGetChatProjectById({
      chatProjectId: maybeChatProjectId,
      userId: user.id,
    });

    if (chatProject === undefined) {
      return NextResponse.json(
        { error: 'Chat project not found or access denied' },
        { status: 403 },
      );
    }
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
      s3BucketKey: key,
      chatProjectId: maybeChatProjectId,
    });

    if (newFile === undefined) {
      await deleteFileFromS3({ key });
      return NextResponse.json({ error: 'Failed to record file in database' }, { status: 500 });
    }

    const extractedPages = await extractTextFromPdf(file);
    await ingestPdf({ fileId: newFile.id, pages: extractedPages });

    const signedUrl = await getSignedUrlFromS3Get({
      key,
      contentType: file.type,
      filename: file.name,
      attachment: false,
    });

    return NextResponse.json({ fileId: key, signedUrl }, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
