import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    databaseUrl: z.string().min(1),
    nextAuthUrl: z.string().min(1),
    nextAuthSecret: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_baseUrl: z.string().min(1),
    NEXT_PUBLIC_passwordValidator: z.enum(['weak', 'medium', 'strong']).default('medium'),
  },
  runtimeEnv: {
    databaseUrl: process.env.DATABASE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_passwordValidator: process.env.NEXT_PUBLIC_PASSWORD_VALIDATOR,
  },
});
