import { dbInsertFile } from '@/db/functions/file';
import { generateImageGemini } from '@/google/image';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { uint8ArrayToArrayBuffer } from '@/utils/buffer';
import { cnanoid } from '@/utils/random';
import { tool } from 'ai';
import { z } from 'zod';

export function getGenerateImageTool({ userEmail, userId }: { userEmail: string; userId: string }) {
  const generateImageTool = tool({
    description: 'Generate an image based on the provided description.',
    parameters: z.object({
      imageDescription: z.string().describe('The description of the image to be generated.'),
    }),
    execute: async ({ imageDescription }) => {
      try {
        const imageUrl = await generateImageFromText({ imageDescription, userEmail, userId });
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
}: {
  imageDescription: string;
  userEmail: string;
  userId: string;
}) {
  const imagePrompt = `Generate an image based on the following description: ${imageDescription}`;

  const imageBuffer = await generateImageGemini({ imagePrompt });
  const arrayBuffer = uint8ArrayToArrayBuffer(imageBuffer);

  const fileName = `${cnanoid(10)}.png`;
  const key = `${userEmail}/generated/${fileName}`;

  await Promise.all([
    uploadFileToS3({
      key,
      fileBuffer: arrayBuffer,
    }),
    dbInsertFile({
      userId,
      name: fileName,
      mimeType: 'image/png',
      size: arrayBuffer.byteLength,
      s3BucketKey: key,
    }),
  ]);

  const s3Url = await getSignedUrlFromS3Get({
    key,
    contentType: 'image/png',
  });

  return s3Url;
}
