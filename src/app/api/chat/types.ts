import { type ActiveIntegration } from '@/db/functions/data-source-integrations';
import { z } from 'zod';

import { type NotionOAuthResponse } from '../auth/notion/types';
import { allModelsSchema } from './schemas';

export type AIModel = z.infer<typeof allModelsSchema>;

export type NotionIntegration = ActiveIntegration & {
  oauthMetadata: NotionOAuthResponse;
};
