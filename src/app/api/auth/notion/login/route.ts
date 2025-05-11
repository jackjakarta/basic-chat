import { env } from '@/env';
import { getUser } from '@/utils/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const integrationType = 'notion';
  const user = await getUser();

  const state = Buffer.from(
    JSON.stringify({
      userId: user.id,
      integrationType,
    }),
  ).toString('base64');

  const searchParams = new URLSearchParams({
    client_id: env.notionClientId,
    redirect_uri: env.notionRedirectUri,
    state,
    response_type: 'code',
    owner: 'user',
  });

  const authUrl = `https://api.notion.com/v1/oauth/authorize?${searchParams.toString()}`;

  return NextResponse.redirect(authUrl);
}
