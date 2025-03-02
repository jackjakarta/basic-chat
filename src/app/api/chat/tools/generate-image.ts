import { generateImage } from '@/openai/image';
import { uploadImageToS3 } from '@/s3';
import { nanoid } from 'nanoid';

export async function generateImageFromText({ imageDescription }: { imageDescription: string }) {
  const prompt = `Generate an image based on the following text: ${imageDescription}`;

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

  const s3Url = await uploadImageToS3({
    fileName,
    fileBuffer: arrayBuffer,
    bucketName: 'generated-images',
  });

  return s3Url;
}
