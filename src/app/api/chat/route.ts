import { dbGetAgentById } from '@/db/functions/agent';
import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { summarizeConversationTitle } from '@/openai/text';
import { getUser } from '@/utils/auth';
import { streamText, tool, type Message } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { myProvider } from './models';
import { constructSystemPrompt } from './system-prompt';
import { generateImageFromText } from './tools/generate-image';
import { braveSearch } from './tools/web-search';
import { modelsSchema, type AIModel } from './types';

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

  try {
    const parsedModelId = modelsSchema.safeParse(modelId);

    if (!parsedModelId.success) {
      return NextResponse.json(
        { error: 'Invalid model ID provided. Please provide a valid model ID.' },
        { status: 400 },
      );
    }

    const validModelId = parsedModelId.data;
    console.debug({ modelId: validModelId });

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

    const systemPrompt = constructSystemPrompt({
      agentInstructions: maybeAgent?.instructions,
      userCustomInstructions: user.settings?.customInstructions,
    });

    const result = streamText({
      model: myProvider.languageModel(validModelId),
      system: systemPrompt,
      messages,
      tools: {
        searchTheWeb: tool({
          description:
            'Search the web if the user asks a question that the assistant cannot answer. Or if the user asks the assistant to search the web.',
          parameters: z.object({
            searchQuery: z.string().describe('The search query provided by the user.'),
          }),
          execute: async ({ searchQuery }) => {
            try {
              const toolResults = await braveSearch(searchQuery);

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
        }),
        generateImage: tool({
          description: 'Generate an image based on the provided description.',
          parameters: z.object({
            imageDescription: z.string().describe('The description of the image to be generated.'),
          }),
          execute: async ({ imageDescription }) => {
            try {
              const imageUrl = await generateImageFromText({ imageDescription });

              if (imageUrl === undefined) {
                return 'An error occurred while generating the image.';
              }

              return imageUrl;
            } catch (error) {
              const errorMessage = 'An error occurred while generating the image. We are sorry.';

              if (error instanceof Error) {
                console.error({ error: error.message });
                throw new Error(errorMessage);
              }

              console.error({ error });
              throw new Error(errorMessage);
            }
          },
        }),
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
            name: conversationTitle,
            userId: user.id,
          });
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error({ error });

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 },
    );
  }
}
