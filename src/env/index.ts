import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    databaseUrl: z.string().min(1),
    nextAuthUrl: z.string().min(1),
    nextAuthSecret: z.string().min(1),
    openaiApiKey: z.string().min(1),
    elevenlabsApiKey: z.string().min(1),
    braveApiKey: z.string().min(1),
    mailjetApiKey: z.string().min(1),
    mailjetApiSecret: z.string().min(1),
    githubClientId: z.string().min(1),
    githubClientSecret: z.string().min(1),
    devMode: z.enum(['true', 'false']).default('false'),
  },
  client: {
    NEXT_PUBLIC_passwordValidator: z.enum(['weak', 'medium', 'strong']).default('medium'),
  },
  runtimeEnv: {
    // Server
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
    devMode: process.env.DEV_MODE,

    // Client
    NEXT_PUBLIC_passwordValidator: process.env.NEXT_PUBLIC_PASSWORD_VALIDATOR,
  },
});
