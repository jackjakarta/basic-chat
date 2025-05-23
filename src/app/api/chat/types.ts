import { type ActiveIntegration } from '@/db/functions/data-source-integrations';

import { type NotionOAuthResponse } from '../auth/notion/types';

export type NotionIntegration = ActiveIntegration & {
  oauthMetadata: NotionOAuthResponse;
};
