import { dbUpsertActiveIntegration } from '@/db/functions/data-source-integrations';
import { env } from '@/env';
import { getBaseUrlByHeaders } from '@/utils/host';
import { NextRequest, NextResponse } from 'next/server';

import { NOTION_DATA_SOURCE_INTEGRATION } from '../constants';
import { notionOAuthResponseSchema } from '../types';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${env.notionClientId}:${env.notionClientSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.notionRedirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Token exchange failed:', error);
      return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
    }

    const rawResponse = await response.json();
    const tokenResponse = notionOAuthResponseSchema.parse(rawResponse);

    await dbUpsertActiveIntegration({
      userId,
      dataSourceIntegrationId: NOTION_DATA_SOURCE_INTEGRATION.id,
      oauthMetadata: {
        type: 'notion',
        ...tokenResponse,
      },
      enabled: true,
    });

    const baseUrl = getBaseUrlByHeaders();
    return NextResponse.redirect(`${baseUrl}/settings/integrations?type=all`);
  } catch (error) {
    console.error('Confluence callback error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
