import { openai } from '.';

export async function getEmbedding({ input }: { input: string }) {
  const embedding = await openai.embeddings.create({
    input,
    model: 'text-embedding-3-small',
    encoding_format: 'float',
  });

  return embedding.data[0]?.embedding;
}
