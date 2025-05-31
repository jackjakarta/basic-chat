import { gemini } from '.';

export async function generateImageGemini({
  imagePrompt,
}: {
  imagePrompt: string;
}): Promise<Buffer> {
  const response = await gemini.models.generateImages({
    model: 'imagen-3.0-generate-002',
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
