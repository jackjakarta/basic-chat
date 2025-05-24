import { type Readable } from 'stream';

export async function streamToBuffer(stream: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

export function uint8ArrayToArrayBuffer(uint8array: Uint8Array): ArrayBuffer {
  return uint8array.buffer.slice(
    uint8array.byteOffset,
    uint8array.byteOffset + uint8array.byteLength,
  ) as ArrayBuffer;
}
