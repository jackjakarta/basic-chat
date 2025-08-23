import { env } from '@/env';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accessKeyId = env.awsAccessKeyId;
const secretAccessKey = env.awsSecretAccessKey;
const endpoint = env.awsS3EndpointUrl;

const s3 = new S3Client({
  forcePathStyle: true,
  region: 'eu-central-1',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

type BucketName = 'chat';

export async function uploadFileToS3({
  key,
  fileBuffer,
  bucketName = 'chat',
  contentType = 'image/png',
}: {
  key: string;
  fileBuffer: ArrayBuffer;
  bucketName?: BucketName;
  contentType?: string;
}) {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(fileBuffer),
    ContentType: contentType,
  });

  const result = await s3.send(uploadCommand);
  return result;
}

export async function deleteFileFromS3({
  key,
  bucketName = 'chat',
}: {
  key: string;
  bucketName?: BucketName;
}) {
  const deleteParams: DeleteObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    const result = await s3.send(command);

    return result;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}

export async function getSignedUrlFromS3Get({
  key,
  bucketName = 'chat',
  filename,
  contentType,
  attachment = true,
  duration = 561600,
}: {
  key: string;
  bucketName?: BucketName;
  filename?: string;
  contentType?: string;
  attachment?: boolean;
  duration?: number;
}) {
  let contentDisposition = attachment ? 'attachment;' : '';
  if (filename !== undefined) {
    contentDisposition = `${contentDisposition} filename=${filename}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ...(contentDisposition !== '' ? { ResponseContentDisposition: contentDisposition } : {}),
    ...(contentType !== undefined ? { ResponseContentType: contentType } : {}),
  });

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: duration });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed GET URL for S3:', error);
    throw error;
  }
}
