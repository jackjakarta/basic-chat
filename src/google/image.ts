import { AIModelRow } from '@/db/schema';

import { gemini } from '.';

export async function generateImageGemini({
  imagePrompt,
  model,
}: {
  imagePrompt: string;
  model: AIModelRow | undefined;
}): Promise<Buffer> {
  const response = await gemini.models.generateImages({
    model: model?.id ?? 'imagen-4.0-generate-001',
    prompt: imagePrompt,
    config: {
      numberOfImages: 1,
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const generatedImage = response.generatedImages[0];

    if (generatedImage?.image?.imageBytes !== undefined) {
      return Buffer.from(generatedImage.image.imageBytes, 'base64');
    }
  }

  throw new Error('No image was generated');
}
