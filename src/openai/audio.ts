import { type Uploadable } from 'openai/uploads.mjs';

import { openai } from '.';

export async function transcribeAudio(file: Uploadable): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'gpt-4o-transcribe',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}
