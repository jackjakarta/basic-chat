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
import { braveSearch } from './tools/web-search';

export async function POST(request: NextRequest) {
  const user = await getUser();

  const {
    id,
    messages,
    modelId,
    isPersonal,
  }: {
    id: string;
    messages: Message[];
    modelId: AIModel;
    isPersonal?: boolean;
  } = await request.json();

  const parsedModelId = modelsSchema.safeParse(modelId);

  if (!parsedModelId.success) {
    return NextResponse.json(
      { error: 'Invalid model ID provided. Please provide a valid model ID.' },
      { status: 400 },
    );
  }

  const conversation = await dbGetOrCreateConversation({
    conversationId: id,
    userId: user.id,
  });

  if (conversation === undefined) {
    return NextResponse.json({ error: 'Could not get or create conversation' }, { status: 500 });
  }

  await dbInsertChatContent({
    conversationId: conversation.id,
    content: messages[messages.length - 1]?.content ?? '',
    role: 'user',
    userId: user.id,
    orderNumber: messages.length,
  });

  const definedModel = parsedModelId.data;
  console.debug({ definedModel });

  const systemPrompt = isPersonal
    ? constructSystemPrompt({
        firstName: user.firstName,
        lastName: user.lastName,
      })
    : constructSystemPrompt({});

  const result = streamText({
    model: myProvider.languageModel(definedModel),
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const toolResults: any = await braveSearch(searchQuery);

          if (toolResults.length === 0) {
            return `I could not find any relevant information about '${searchQuery}'.`;
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
          content: assistantMessage.text,
        });

        if (conversationTitle !== undefined && conversationTitle !== null) {
          await dbUpdateConversationTitle({
            conversationId: conversation.id,
            name: conversationTitle,
          });
        }
      }
    },
  });

  return result.toDataStreamResponse();
}
