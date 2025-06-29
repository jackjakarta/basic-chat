import { openai } from '@/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const rawBody = await request.text();

    const event = await openai.webhooks.unwrap(rawBody, headers);
    console.debug({ event });

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
