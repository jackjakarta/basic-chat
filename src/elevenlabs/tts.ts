import { streamToBuffer } from '@/utils/buffer';

import { elevenlabs } from '.';

const voiceId = 'EXAVITQu4vr4xnSDxMaL';

export async function generateTTS({ text }: { text: string }) {
  try {
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId: 'eleven_flash_v2_5',
      outputFormat: 'mp3_44100_128',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.8,
      },
    });

    const audioBuffer = await streamToBuffer(audioStream);

    return audioBuffer;
  } catch (error) {
    console.error('ElevenLabs SDK Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate TTS');
  }
}
