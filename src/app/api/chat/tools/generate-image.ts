import { generateImage } from '@/openai/image';

export async function generateImageFromText({ imageDescription }: { imageDescription: string }) {
  const prompt = `Generate an image based on the following text: ${imageDescription}`;

  const maybeImageUrl = await generateImage({ prompt });

  return maybeImageUrl;
}
