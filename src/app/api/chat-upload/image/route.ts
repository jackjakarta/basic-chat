import { dbInsertFile } from '@/db/functions/file';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { getUser } from '@/utils/auth';
import { uint8ArrayToArrayBuffer } from '@/utils/buffer';
import { getFileExtension } from '@/utils/files';
import { cnanoid } from '@/utils/random';
import { NextRequest, NextResponse } from 'next/server';

import { preprocessImage } from './utils';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 10;
const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

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

  if (!SUPPORTED_IMAGE_EXTENSIONS.includes(fileExtension.toLowerCase())) {
    return NextResponse.json({ error: `${fileExtension} is not supported` }, { status: 420 });
  }

  const keyPrefix = cnanoid(12);
  const key = `${user.email}/uploaded/${keyPrefix}_${file.name}`;

  try {
    const { buffer: processedImageBuffer, type: processedImageType } = await preprocessImage(
      file,
      MAX_FILE_SIZE_BYTES,
    );

    await Promise.all([
      uploadFileToS3({
        key,
        fileBuffer: uint8ArrayToArrayBuffer(processedImageBuffer),
        contentType: processedImageType,
      }),
      dbInsertFile({
        userId: user.id,
        name: file.name,
        mimeType: processedImageType,
        size: file.size,
        s3BucketKey: key,
      }),
    ]);

    const signedUrl = await getSignedUrlFromS3Get({
      key,
      contentType: processedImageType,
      filename: file.name,
      attachment: false,
    });

    return NextResponse.json({ fileId: key, signedUrl }, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
