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

export function getToolResultSchema<T>(resultSchema: z.ZodType<T>) {
  return z.object({
    success: z.literal(true).describe('Indicates that the tool execution was successful.'),
    result: z.array(resultSchema).describe('The result of the tool execution.'),
  });
}

export const toolErrorSchema = z.object({
  success: z.literal(false).describe('Indicates that the tool execution failed.'),
  error: z.string().describe('A message describing the error that occurred during tool execution.'),
});

export type ToolError = z.infer<typeof toolErrorSchema>;
