import { transcribeAudio } from '@/openai/audio';
import { File } from 'formdata-node';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  videoUrl: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { videoUrl } = parsed.data;

    const audioFileBuffer = await getAudioBuffer({ videoUrl });
    const buffer = Buffer.from(audioFileBuffer);
    const audioFile = new File([buffer], 'uploaded-audio.wav', { type: 'video/wav' });

    const transcription = await transcribeAudio({ audioFile });

    return NextResponse.json({ success: true, transcription }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAudioBuffer({ videoUrl }: { videoUrl: string }): Promise<ArrayBuffer> {
  const endpoint = `http://127.0.0.1:8000/api/v1/convert/?url=${encodeURIComponent(videoUrl)}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  return buffer;
}
