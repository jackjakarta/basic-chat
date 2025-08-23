import { dbInsertFile } from '@/db/functions/file';
import { deleteFileFromS3, getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
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
  const key = `${user.email}/uploaded/images/${keyPrefix}_${file.name}`;

  try {
    const { buffer: processedImageBuffer, type: processedImageType } = await preprocessImage(
      file,
      MAX_FILE_SIZE_BYTES,
    );

    const fileBuffer = uint8ArrayToArrayBuffer(processedImageBuffer);

    const s3Result = await uploadFileToS3({
      key,
      fileBuffer,
      contentType: processedImageType,
    });

    if (s3Result.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: 'Failed to upload file to S3' }, { status: 500 });
    }

    const newFile = await dbInsertFile({
      userId: user.id,
      name: file.name,
      mimeType: processedImageType,
      size: fileBuffer.byteLength,
      s3BucketKey: key,
    });

    if (newFile === undefined) {
      await deleteFileFromS3({ key });
      return NextResponse.json({ error: 'Failed to record file in database' }, { status: 500 });
    }

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
