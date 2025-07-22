import { type AIModelRow } from '@/db/schema';
import { env } from '@/env';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { createXai } from '@ai-sdk/xai';

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const anthropic = createAnthropic({
  apiKey: env.anthropicApiKey,
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
  const { id: modelId, provider } = model;

  switch (provider) {
    case 'openai':
      return openai(modelId);

    case 'google':
      return google(modelId);

    case 'anthropic':
      return anthropic(modelId);

    case 'mistral':
      return mistral(modelId);

    case 'xai':
      return xai(modelId);

    default:
      throw new Error(`Model ${modelId} not found`);
  }
}
