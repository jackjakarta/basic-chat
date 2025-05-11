import { openai } from '.';

type ImageQuality = 'standard' | 'hd';
type ImageStyle = 'natural' | 'vivid';
type ImageSize = '1024x1792' | '1792x1024' | '1024x1024';

export async function generateImage({
  prompt,
  quality = 'standard',
  amount = 1,
  style = 'vivid',
  size = '1792x1024',
}: {
  prompt: string;
  quality?: ImageQuality;
  amount?: number;
  style?: ImageStyle;
  size?: ImageSize;
}) {
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: amount,
    quality,
    size,
    style,
  });

  const imageUrl = image.data?.[0]?.url;

  return imageUrl;
}
