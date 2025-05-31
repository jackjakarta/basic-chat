import { generateImageGemini } from '@/google/image';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { uint8ArrayToArrayBuffer } from '@/utils/buffer';
import { tool } from 'ai';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export function generateImageTool({ userEmail }: { userEmail: string }) {
  const generateImageTool = tool({
    description: 'Generate an image based on the provided description.',
    parameters: z.object({
      imageDescription: z.string().describe('The description of the image to be generated.'),
    }),
    execute: async ({ imageDescription }) => {
      try {
        const imageUrl = await generateImageFromText({ imageDescription, userEmail });
        console.debug({ imageUrl });

        if (imageUrl === undefined) {
          return 'An error occurred while generating the image.';
        }

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
}: {
  imageDescription: string;
  userEmail: string;
}) {
  const imagePrompt = `Generate an image based on the following description: ${imageDescription}`;
  const imageBuffer = await generateImageGemini({ imagePrompt });

  const arrayBuffer = uint8ArrayToArrayBuffer(imageBuffer);
  const fileName = `${userEmail}/generated/${nanoid(10)}.png`;

  const [, s3Url] = await Promise.all([
    uploadFileToS3({
      key: fileName,
      fileBuffer: arrayBuffer,
      bucketName: 'chat',
    }),
    getSignedUrlFromS3Get({
      key: fileName,
      duration: 7200,
      bucketName: 'chat',
    }),
  ]);

  return s3Url;
}
