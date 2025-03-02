import { type Uploadable } from 'openai/uploads.mjs';

import { openai } from '.';

export async function transcribeAudio({ audioFile }: { audioFile: Uploadable }): Promise<string> {
  const transcriptionObject = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  const transcription = transcriptionObject.text;

  return transcription;
}
