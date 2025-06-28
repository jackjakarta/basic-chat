import { env } from '@/env';
import { codeResultToMarkdown } from '@/utils/markdown';
import { Anthropic } from '@anthropic-ai/sdk';
import { tool } from 'ai';
import { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: env.anthropicApiKey,
  defaultHeaders: {
    'anthropic-beta': 'code-execution-2025-05-22',
  },
});

export function getExecuteCodeTool() {
  const executeCodeChatTool = tool({
    description:
      'Execute code if the user asks a question that would be best solved by executing some code. Or if the user asks the assistant to execute code.',
    parameters: z.object({
      codeInstructions: z
        .string()
        .describe(
          'The code instructions provided by the user.(e.g. mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
        ),
    }),
    execute: async ({ codeInstructions }) => {
      try {
        const toolResults = await executeCode({ codeInstructions });
        console.debug({ toolResults });

        if (!toolResults) {
          return 'ERROR: I could not execute the code.';
        }

        const codeResult =
          toolResults.content[1]?.type === 'server_tool_use' ? toolResults.content[1].input : null;

        // @ts-expect-error - we know this is a string
        const parsedCode = z.string().safeParse(codeResult.code);

        if (!parsedCode.success) {
          return 'ERROR: I could not execute the code. Please check the code and try again.';
        }

        const code = parsedCode.data;
        const formatedCode = codeResultToMarkdown(code);

        return { ...toolResults, formatedCode };
      } catch (error) {
        const errorMessage = `An error occurred while executing code. We are sorry.`;

        if (error instanceof Error) {
          console.error({ error: error.message });
          throw new Error(errorMessage);
        }

        console.error({ error });
        throw new Error(errorMessage);
      }
    },
  });

  return executeCodeChatTool;
}

async function executeCode({ codeInstructions }: { codeInstructions: string }) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: codeInstructions,
      },
    ],
    tools: [
      {
        // @ts-expect-error - This is a bug in the SDK
        type: 'code_execution_20250522',
        name: 'code_execution',
      },
    ],
  });

  return response;
}
