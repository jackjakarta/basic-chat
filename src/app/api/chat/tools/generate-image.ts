import { generateImage } from '@/openai/image';
import { getSignedUrlFromS3Get, uploadFileToS3 } from '@/s3';
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
