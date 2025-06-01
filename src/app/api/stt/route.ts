import { transcribeAudio } from '@/openai/audio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (file === null) {
      return NextResponse.json({ error: 'Could not find file in form data' }, { status: 400 });
    }

    if (typeof file === 'string') {
      return NextResponse.json(
        { error: 'file FormData entry value was of type "string", but expected type "File"' },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const newFile = new File([buffer], file.name, { type: file.type });

    const transcribedAudio = await transcribeAudio(newFile);
    return NextResponse.json({ transcript: transcribedAudio }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
