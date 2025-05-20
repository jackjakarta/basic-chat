import sharp from 'sharp';

import { getFileExtension } from './route';

export async function preprocessImage(
  file: File,
  maxSizeBytes: number,
): Promise<{ buffer: Uint8Array; type: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = new Uint8Array(arrayBuffer);

  if (originalBuffer.length <= maxSizeBytes) {
    return { buffer: originalBuffer, type: file.type };
  }

  const extension = getFileExtension(file.name);
  const format =
    extension === 'png'
      ? 'png'
      : extension === 'gif'
        ? 'gif'
        : extension === 'webp'
          ? 'webp'
          : 'jpeg';

  // Get original dimensions
  const metadata = await sharp(originalBuffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Start with a reasonable scale
  let scale = 1.0;
  let quality = 80;
  let processedBuffer: Buffer = Buffer.from(originalBuffer);

  // Helper to process image with current params
  async function process(scale: number, quality: number) {
    let instance = sharp(originalBuffer);
    if (scale < 1.0) {
      instance = instance.resize(Math.round(width * scale), Math.round(height * scale));
    }
    if (format === 'jpeg' || format === 'webp') {
      return await instance.toFormat(format as keyof sharp.FormatEnum, { quality }).toBuffer();
    } else if (format === 'png') {
      // PNG: use compressionLevel (0-9), higher is more compressed
      return await instance.png({ compressionLevel: 9 }).toBuffer();
    } else {
      // fallback
      return await instance.toFormat(format as keyof sharp.FormatEnum).toBuffer();
    }
  }

  // 1. Versuche, nur die Qualität zu reduzieren
  while (quality >= 30) {
    processedBuffer = await process(scale, quality);
    if (processedBuffer.length <= maxSizeBytes) break;
    quality -= 10;
  }

  // 2. Wenn immer noch zu groß, skaliere das Bild schrittweise herunter
  while (processedBuffer.length > maxSizeBytes && scale > 0.3) {
    scale -= 0.1;
    processedBuffer = await process(scale, quality);
  }

  // Falls immer noch zu groß, gib das kleinste Ergebnis zurück
  return {
    buffer: new Uint8Array(processedBuffer),
    type: `image/${format}`,
  };
}
