import { generateImage } from '@/openai/image';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
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
  const prompt = `Generate an image based on the following description: ${imageDescription}`;
  const imageUrl = await generateImage({ prompt });

  if (imageUrl === undefined) {
    return undefined;
  }

  const response = await fetch(imageUrl);

  if (!response.ok) {
    return undefined;
  }

  const arrayBuffer = await response.arrayBuffer();
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
