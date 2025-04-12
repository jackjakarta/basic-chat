import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const passwordValidatorSchema = z.enum(['weak', 'medium', 'strong']).default('medium');

export const env = createEnv({
  server: {
    databaseUrl: z.string().url(),
    nextAuthUrl: z.string().url(),
    nextAuthSecret: z.string().min(1),
    openaiApiKey: z.string().min(1),
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
    devMode: z.enum(['true', 'false']).default('false'),
  },
  client: {
    NEXT_PUBLIC_passwordValidator: passwordValidatorSchema,
  },
  runtimeEnv: {
    databaseUrl: process.env.DATABASE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
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
    NEXT_PUBLIC_passwordValidator: process.env.NEXT_PUBLIC_PASSWORD_VALIDATOR,
  },
});
