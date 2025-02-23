import { generateTTS } from '@/elevenlabs/tts';
import { getValidSession } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await getValidSession();

  try {
    const { text } = await req.json();
    const audioBuffer = await generateTTS({ text });

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
