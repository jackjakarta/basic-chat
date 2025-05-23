import { type InsertAIModelRow } from '../schema';

export const models: InsertAIModelRow[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'GPT-4.1 model',
    provider: 'openai',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'GPT-4.1 Mini model',
    provider: 'openai',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'GPT-4o model',
    provider: 'openai',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'gemini-2.5-pro-exp-03-25',
    name: 'Gemini 2.5 Pro',
    description: 'Gemini 2.5 Pro model',
    provider: 'google',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Gemini 2.0 Flash model',
    provider: 'google',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
    description: 'Claude 3.7 Sonnet model',
    provider: 'anthropic',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'pixtral-large-latest',
    name: 'Pixtral Large Latest Model (Mistral)',
    description:
      'Pixtral Large Latest Model (Mistral) - A large language model designed for various tasks.',
    provider: 'mistral',
    type: 'text',
    isEnabled: true,
  },
  {
    id: 'grok-2-vision-1212',
    name: 'Grok 2',
    description: 'xAI Grok-2 - A large language model designed for various tasks.',
    provider: 'xai',
    type: 'text',
    isEnabled: true,
  },
];
