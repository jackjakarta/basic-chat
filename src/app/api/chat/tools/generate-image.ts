import { generateImage } from '@/openai/image';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
import { tool } from 'ai';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export function generateImageTool() {
  const generateImageTool = tool({
    description: 'Generate an image based on the provided description.',
    parameters: z.object({
      imageDescription: z.string().describe('The description of the image to be generated.'),
    }),
    execute: async ({ imageDescription }) => {
      try {
        const imageUrl = await generateImageFromText({ imageDescription });
        console.debug({ imageUrl });

        if (imageUrl === undefined) {
          return 'An error occurred while generating the image.';
        }

        return imageUrl;
      } catch (error) {
        const errorMessage = 'An error occurred while generating the image. We are sorry.';

        if (error instanceof Error) {
          console.error({ error: error.message });
          throw new Error(errorMessage);
        }

        console.error({ error });
        throw new Error(errorMessage);
      }
    },
  });

  return generateImageTool;
}

async function generateImageFromText({ imageDescription }: { imageDescription: string }) {
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
  const fileName = `${nanoid(10)}.png`;

  const s3Key = await uploadFileToS3({
    key: fileName,
    fileBuffer: arrayBuffer,
  });

  const s3Url = await getSignedUrlFromS3Get({
    key: s3Key,
    duration: 7200,
  });

  return s3Url;
}
