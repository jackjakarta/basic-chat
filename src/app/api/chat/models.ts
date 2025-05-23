import { type AIModelRow } from '@/db/schema';
import { env } from '@/env';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { createXai } from '@ai-sdk/xai';

const anthropic = createAnthropic({
  apiKey: env.anthropicApiKey,
});

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const google = createGoogleGenerativeAI({
  apiKey: env.geminiApiKey,
});

const mistral = createMistral({
  apiKey: env.mistralApiKey,
});

const xai = createXai({
  apiKey: env.xaiApiKey,
});

export function getModel(model: AIModelRow) {
  const { id: modelId } = model;

  switch (modelId) {
    case 'gpt-4.1':
    case 'gpt-4.1-mini':
    case 'gpt-4o':
      return openai(modelId);

    case 'gemini-2.5-pro-exp-03-25':
    case 'gemini-2.0-flash':
      return google(modelId);

    case 'claude-3-7-sonnet-20250219':
      return anthropic(modelId);

    case 'pixtral-large-latest':
      return mistral(modelId);

    case 'grok-2-vision-1212':
      return xai(modelId);

    default:
      throw new Error(`Model ${modelId} not found`);
  }
}
