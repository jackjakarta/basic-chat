import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    databaseUrl: z.string().url(),
    nextAuthUrl: z.string().url(),
    nextAuthSecret: z.string().min(1),
    openaiApiKey: z.string().min(1),
    openaiWebhookSecret: z.string().min(1),
    elevenlabsApiKey: z.string().min(1),
    braveApiKey: z.string().min(1),
    mailjetApiKey: z.string().min(1),
    mailjetApiSecret: z.string().min(1),
    githubClientId: z.string().min(1),
    githubClientSecret: z.string().min(1),
    googleClientId: z.string().min(1),
    googleClientSecret: z.string().min(1),
    awsAccessKeyId: z.string().min(1),
    awsSecretAccessKey: z.string().min(1),
    awsS3EndpointUrl: z.string().min(1),
    utilsApiUrl: z.string().url(),
    utilsApiKey: z.string().min(1),
    jwtSecret: z.string().min(1),
    geminiApiKey: z.string().min(1),
    anthropicApiKey: z.string().min(1),
    mistralApiKey: z.string().min(1),
    xaiApiKey: z.string().min(1),
    notionClientId: z.string().min(1),
    notionClientSecret: z.string().min(1),
    notionRedirectUri: z.string().url(),
    stripeSecretKey: z.string().min(1),
    stripeWebhookSecret: z.string().min(1),
    githubAccessToken: z.string().min(1),
    devMode: z.enum(['true', 'false']).default('false'),
  },
  client: {
    NEXT_PUBLIC_stripePublishableKey: z.string().min(1),
  },
  runtimeEnv: {
    databaseUrl: process.env.DATABASE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiWebhookSecret: process.env.OPENAI_WEBHOOK_SECRET,
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY,
    braveApiKey: process.env.BRAVE_API_KEY,
    mailjetApiKey: process.env.MAILJET_API_KEY,
    mailjetApiSecret: process.env.MAILJET_API_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3EndpointUrl: process.env.AWS_S3_ENDPOINT_URL,
    devMode: process.env.DEV_MODE,
    utilsApiUrl: process.env.UTILS_API_URL,
    utilsApiKey: process.env.UTILS_API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    mistralApiKey: process.env.MISTRAL_API_KEY,
    xaiApiKey: process.env.XAI_API_KEY,
    notionClientId: process.env.NOTION_CLIENT_ID,
    notionClientSecret: process.env.NOTION_CLIENT_SECRET,
    notionRedirectUri: process.env.NOTION_REDIRECT_URI,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    githubAccessToken: process.env.GITHUB_ACCESS_TOKEN,
    NEXT_PUBLIC_stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});
