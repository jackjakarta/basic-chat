import { env } from '@/env';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { z } from 'zod';

const accessKeyId = env.awsAccessKeyId;
const secretAccessKey = env.awsSecretAccessKey;
const endpoint = env.awsS3EndpointUrl;
const region = env.awsRegion;
const bucketBaseUrl = env.awsBucketUrl;

const s3 = new S3Client({
  forcePathStyle: true,
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const bucketNameSchema = z.literal('generated-images');
export type BucketName = z.infer<typeof bucketNameSchema>;

export async function uploadImageToS3({
  fileName,
  fileBuffer,
  bucketName,
}: {
  fileName: string;
  fileBuffer: ArrayBuffer;
  bucketName: BucketName;
}): Promise<string> {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: Buffer.from(fileBuffer),
    ContentType: 'image/png',
  });

  await s3.send(uploadCommand);

  const imageUrl = `${bucketBaseUrl}/${bucketName}/${fileName}`;

  return imageUrl;
}

export async function deleteFileFromS3({
  key,
  bucketName,
}: {
  key: string;
  bucketName: BucketName;
}) {
  const deleteParams: DeleteObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
}
