import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { getUser } from '@/utils/auth';
import { uint8ArrayToArrayBuffer } from '@/utils/buffer';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { preprocessImage } from './utils';

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 10; // 10MB
const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

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

  const fileId = `${user.email}/uploaded/image_${nanoid()}`;
  const fileExtension = getFileExtension(file.name);

  if (
    !SUPPORTED_IMAGE_EXTENSIONS.some((supportedExtension) => supportedExtension == fileExtension)
  ) {
    return NextResponse.json({ error: `${fileExtension} is not supported` }, { status: 400 });
  }

  try {
    const { buffer: processedImageBuffer, type: processedImageType } = await preprocessImage(
      file,
      MAX_FILE_SIZE_BYTES,
    );

    await uploadFileToS3({
      key: fileId,
      fileBuffer: uint8ArrayToArrayBuffer(processedImageBuffer),
      contentType: processedImageType,
      bucketName: 'chat',
    });

    const signedURL = await getSignedUrlFromS3Get({
      key: fileId,
      bucketName: 'chat',
      contentType: processedImageType,
      filename: file.name,
      attachment: false,
    });

    return NextResponse.json({ fileId, signedURL }, { status: 200 });
  } catch (error) {
    console.error('Error calling files upload route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export function getFileExtension(fileName: string) {
  const parts = fileName.split('.');

  const lastPart = parts[parts.length - 1];

  if (lastPart === undefined) {
    return fileName;
  }

  return lastPart;
}
