import { streamToBuffer } from '@/utils/buffer';

import { elevenlabs } from '.';

export async function generateTTS({ text }: { text: string }) {
  try {
    const voiceId = 'xeBpkkuzgxa0IwKt7NTP';

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      model_id: 'eleven_flash_v2_5',
      output_format: 'mp3_44100_128',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    });

    const audioBuffer = await streamToBuffer(audioStream);

    return audioBuffer;
  } catch (error) {
    console.error('ElevenLabs SDK Error:', error);
    throw new Error('Failed to generate TTS');
  }
}
