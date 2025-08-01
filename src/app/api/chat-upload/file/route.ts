import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { getUser } from '@/utils/auth';
import { getFileExtension } from '@/utils/files';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 2;
const SUPPORTED_FILE_EXTENSIONS = ['pdf'];

export async function POST(req: NextRequest) {
  const user = await getUser();

  const formData = await req.formData();
  const file = formData.get('file');

  if (file === null) {
    return NextResponse.json({ error: 'Could not find file in form data' }, { status: 400 });
  }

  if (typeof file === 'string') {
    return NextResponse.json(
      { error: 'file FormData entry value was of type "string", but expected type "File"' },
      { status: 400 },
    );
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

  const fileId = `${user.email}/uploaded/files/file_${nanoid()}.${fileExtension}`;

  try {
    const [, signedUrl] = await Promise.all([
      uploadFileToS3({
        key: fileId,
        bucketName: 'chat',
        fileBuffer: await file.arrayBuffer(),
        contentType: file.type,
      }),
      getSignedUrlFromS3Get({
        key: fileId,
        bucketName: 'chat',
        contentType: file.type,
        filename: file.name,
        attachment: false,
      }),
    ]);

    return NextResponse.json({ fileId, signedUrl }, { status: 200 });
  } catch (error) {
    console.error('Error calling files upload route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
