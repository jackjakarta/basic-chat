import { dbGetAgentById } from '@/db/functions/agent';
import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { summarizeConversationTitle } from '@/openai/text';
import { getUser } from '@/utils/auth';
import { streamText, type Message } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { modelsSchema, myProvider, type AIModel } from './models';
import { constructSystemPrompt } from './system-prompt';
import { generateImageFromText } from './tools/generate-image';
import { braveSearch } from './tools/web-search';

export async function POST(request: NextRequest) {
  const user = await getUser();

  const {
    chatId,
    messages,
    modelId,
    agentId,
  }: {
    chatId: string;
    messages: Message[];
    modelId: AIModel;
    agentId?: string;
  } = await request.json();

  const parsedModelId = modelsSchema.safeParse(modelId);

  if (!parsedModelId.success) {
    return NextResponse.json(
      { error: 'Invalid model ID provided. Please provide a valid model ID.' },
      { status: 400 },
    );
  }

  const maybeAgent =
    agentId !== undefined ? await dbGetAgentById({ agentId, userId: user.id }) : undefined;

  const conversation = await dbGetOrCreateConversation({
    conversationId: chatId,
    userId: user.id,
    agentId: maybeAgent?.id,
  });

  if (conversation === undefined) {
    return NextResponse.json({ error: 'Could not get or create conversation' }, { status: 500 });
  }

  const userMessage = messages[messages.length - 1]?.content;

  await dbInsertChatContent({
    conversationId: conversation.id,
    content: userMessage ?? '',
    role: 'user',
    userId: user.id,
    orderNumber: messages.length,
  });

  const agentInstructions = maybeAgent !== undefined ? maybeAgent.instructions : undefined;
  const systemPrompt = constructSystemPrompt({ agentInstructions });

  console.debug({ modelId });
  console.debug({ systemPrompt });

  const result = streamText({
    model: myProvider.languageModel(modelId),
    system: systemPrompt,
    messages,
    tools: {
      searchTheWeb: {
        description:
          'Search the web if the user asks a question that the assistant cannot answer. Or if the user asks the assistant to search the web.',
        parameters: z.object({
          searchQuery: z.string().describe('The search query provided by the user.'),
        }),
        execute: async ({ searchQuery }) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const toolResults: any = await braveSearch(searchQuery);

            if (!toolResults) {
              return `I could not find any relevant information about '${searchQuery}'.`;
            }

            console.debug({ toolResults });
            return toolResults;
          } catch (error) {
            const errorMessage = `An error occurred while searching the web. We are sorry.`;

            if (error instanceof Error) {
              console.error({ error: error.message });
              throw new Error(errorMessage);
            }

            console.error({ error });
            throw new Error(errorMessage);
          }
        },
      },
      generateImage: {
        description: 'Generate an image based on the description provided by the user.',
        parameters: z.object({
          imageDescription: z
            .string()
            .describe('The description of the image provided by the user.'),
        }),
        execute: async ({ imageDescription }) => {
          const toolResults = await generateImageFromText({ imageDescription });

          if (toolResults === undefined) {
            throw new Error('An error occurred while generating the image.');
          }

          console.debug({ toolResults });
          return toolResults;
        },
      },
    },
    async onFinish(assistantMessage) {
      await dbInsertChatContent({
        content: assistantMessage.text,
        role: 'assistant',
        userId: user.id,
        orderNumber: messages.length + 1,
        conversationId: conversation.id,
      });

      if (messages.length === 1 || messages.length === 2 || conversation.name === null) {
        const conversationTitle = await summarizeConversationTitle({
          userMessage: userMessage ?? '',
          assistantMessage: assistantMessage.text,
        });

        await dbUpdateConversationTitle({
          conversationId: conversation.id,
          name: conversationTitle ?? conversation.id,
          userId: user.id,
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
