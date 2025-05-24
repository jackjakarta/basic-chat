import { Readable } from 'stream';

import { streamToBuffer, uint8ArrayToArrayBuffer } from './buffer';

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

describe('uint8ArrayToArrayBuffer', () => {
  it('returns an ArrayBuffer containing the same bytes as the Uint8Array', () => {
    const original = new Uint8Array([10, 20, 30, 40, 50]);
    const buf = uint8ArrayToArrayBuffer(original);
    const asView = new Uint8Array(buf);

    expect(buf).toBeInstanceOf(ArrayBuffer);
    expect(asView).toEqual(original);
  });

  it('correctly handles a subarray (non-zero byteOffset)', () => {
    // Create a backing buffer [1,2,3,4,5]
    const backing = new ArrayBuffer(5);
    const fullView = new Uint8Array(backing);
    fullView.set([1, 2, 3, 4, 5]);

    // Create a subarray from index 1 to length 3: [2,3,4]
    const sub = new Uint8Array(backing, /*byteOffset=*/ 1, /*length=*/ 3);
    expect(Array.from(sub)).toEqual([2, 3, 4]); // sanity-check

    const sliced = uint8ArrayToArrayBuffer(sub);
    const slicedView = new Uint8Array(sliced);

    expect(slicedView).toEqual(sub);
  });

  it('returns an empty ArrayBuffer for an empty Uint8Array', () => {
    const empty = new Uint8Array();
    const buf = uint8ArrayToArrayBuffer(empty);
    const view = new Uint8Array(buf);

    expect(buf.byteLength).toBe(0);
    expect(view.length).toBe(0);
  });

  it('returns a new, independent buffer (modifying the result does not affect the original)', () => {
    const original = new Uint8Array([7, 8, 9]);
    const buf = uint8ArrayToArrayBuffer(original);
    const resultView = new Uint8Array(buf);

    // mutate the result
    resultView[0] = 99;

    // original must stay unchanged
    expect(original[0]).toBe(7);
    expect(resultView[0]).toBe(99);
  });
});
