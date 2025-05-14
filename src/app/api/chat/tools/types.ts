import { z } from 'zod';

const toolsSchema = z.enum([
  'searchTheWeb',
  'generateImage',
  'getBarcaMatches',
  'searchFiles',
  'searchNotion',
]);

export type ToolName = z.infer<typeof toolsSchema>;
