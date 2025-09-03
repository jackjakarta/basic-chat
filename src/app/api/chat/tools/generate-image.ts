import { dbInsertFile } from '@/db/functions/file';
import { type AIModelRow } from '@/db/schema';
import { generateImageGemini } from '@/google/image';
import { deleteFileFromS3, getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { uint8ArrayToArrayBuffer } from '@/utils/buffer';
import { cnanoid } from '@/utils/random';
import { tool } from 'ai';
import { z } from 'zod';

export function getGenerateImageTool({
  userEmail,
  userId,
  model,
}: {
  userEmail: string;
  userId: string;
  model: AIModelRow | undefined;
}) {
  const generateImageTool = tool({
    description: 'Generate an image based on the provided description.',
    parameters: z.object({
      imageDescription: z.string().describe('The description of the image to be generated.'),
    }),
    execute: async ({ imageDescription }) => {
      try {
        const imageUrl = await generateImageFromText({
          imageDescription,
          userEmail,
          userId,
          model,
        });
        return imageUrl;
      } catch {
        return 'An error occurred while generating the image.';
      }
    },
  });

  return generateImageTool;
}

async function generateImageFromText({
  imageDescription,
  userEmail,
  userId,
  model,
}: {
  imageDescription: string;
  userEmail: string;
  userId: string;
  model: AIModelRow | undefined;
}) {
  const imagePrompt = `Generate an image based on the following description: ${imageDescription}`;

  const imageBuffer = await generateImageGemini({ imagePrompt, model });
  const arrayBuffer = uint8ArrayToArrayBuffer(imageBuffer);

  const fileName = `${cnanoid(10)}.png`;
  const key = `${userEmail}/generated/${fileName}`;

  const s3Result = await uploadFileToS3({
    key,
    fileBuffer: arrayBuffer,
  });

  if (s3Result.$metadata.httpStatusCode !== 200) {
    throw new Error('Failed to upload image to S3');
  }

  const newFile = await dbInsertFile({
    userId,
    name: fileName,
    mimeType: 'image/png',
    size: arrayBuffer.byteLength,
    s3BucketKey: key,
  });

  if (newFile === undefined) {
    await deleteFileFromS3({ key });
    throw new Error('Failed to insert file record into database');
  }

  const s3Url = await getSignedUrlFromS3Get({
    key,
    contentType: 'image/png',
  });

  return s3Url;
}
