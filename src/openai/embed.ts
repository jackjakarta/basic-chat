import { openai } from '.';

export async function getTextEmbedding({ input }: { input: string }) {
  const embedding = await openai.embeddings.create({
    input,
    model: 'text-embedding-ada-002',
    encoding_format: 'float',
  });

  return embedding.data[0]?.embedding;
}
