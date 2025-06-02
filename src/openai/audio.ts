import { env } from '@/env';
import fetch from 'node-fetch';

const endpoint = 'https://api.openai.com/v1/audio/transcriptions';
const apiKey = env.openaiApiKey;

export async function transcribeAudio(audioFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioFile);
  formData.append('model', 'gpt-4o-transcribe');

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ContentType: 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const json = (await response.json()) as any;

  if (!json.text) {
    throw new Error('Transcription failed: No text returned');
  }

  return json.transcript as string;
}
