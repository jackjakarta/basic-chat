import { Readable } from 'stream';

import { streamToBuffer } from './buffer';

describe('streamToBuffer', () => {
  it('should convert a readable stream to a buffer', async () => {
    const data = Buffer.from('Hello, world!');
    const stream = Readable.from([data]);

    const result = await streamToBuffer(stream);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe(data.toString());
  });

  it('should handle an empty stream', async () => {
    const stream = Readable.from([]);

    const result = await streamToBuffer(stream);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBe(0);
  });

  it('should handle a stream with multiple chunks', async () => {
    const chunks = [Buffer.from('Chunk1'), Buffer.from('Chunk2'), Buffer.from('Chunk3')];
    const stream = Readable.from(chunks);

    const result = await streamToBuffer(stream);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.toString()).toBe(Buffer.concat(chunks).toString());
  });
});
