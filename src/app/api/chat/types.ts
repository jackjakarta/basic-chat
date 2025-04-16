import { z } from 'zod';

export const modelsSchema = z.enum([
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o',
  'gpt-4o-mini',
]);

export type AIModel = z.infer<typeof modelsSchema>;
