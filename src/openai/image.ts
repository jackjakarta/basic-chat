import { openai } from '.';

export async function generateImage({ prompt }: { prompt: string }) {
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
  });

  const imageUrl = image.data[0]?.url;

  return imageUrl;
}
