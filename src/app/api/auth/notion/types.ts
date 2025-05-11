import { z } from 'zod';

export const notionOAuthResponseSchema = z.object({
  access_token: z.string(),
});

export type NotionOAuthResponse = z.infer<typeof notionOAuthResponseSchema> & {
  type: 'notion';
};

export type OAuthTokenMetadata = NotionOAuthResponse;

export const dataSourceIntegrationTypeSchema = z.enum(['notion']);
export type DataSourceIntegrationType = z.infer<typeof dataSourceIntegrationTypeSchema>;

export const dataSourceIntegrationStateSchema = z.enum(['active', 'comingSoon']);
export type DataSourceIntegrationState = z.infer<typeof dataSourceIntegrationStateSchema>;
