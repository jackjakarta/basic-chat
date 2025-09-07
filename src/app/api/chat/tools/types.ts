import { z } from 'zod';

export const toolsSchema = z.enum([
  'searchTheWeb',
  'generateImage',
  'getBarcaMatches',
  'assistantSearchFiles',
  'searchNotion',
  'searchProjectFiles',
]);

export type ToolName = z.infer<typeof toolsSchema>;
