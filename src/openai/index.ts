import { env } from '@/env';
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  webhookSecret: env.openaiWebhookSecret,
});
