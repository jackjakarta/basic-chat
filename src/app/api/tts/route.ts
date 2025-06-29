import { generateTTS } from '@/elevenlabs/tts';
import { getValidSession } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  text: z.string().min(1),
});

export async function POST(req: NextRequest) {
  await getValidSession();

  try {
    const json = await req.json();
    const body = requestSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json({ error: body.error.errors }, { status: 400 });
    }

    const { text } = body.data;
    const audioBuffer = await generateTTS({ text });

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
