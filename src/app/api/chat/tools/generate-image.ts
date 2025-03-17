import { generateImage } from '@/openai/image';
import { uploadFileToS3 } from '@/s3';
import { nanoid } from 'nanoid';

export async function generateImageFromText({ imageDescription }: { imageDescription: string }) {
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

  const s3Url = await uploadFileToS3({
    fileName,
    fileBuffer: arrayBuffer,
    bucketName: 'generated-images',
    contentType: 'image/png',
  });

  return s3Url;
}
