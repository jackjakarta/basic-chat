import { dbGetAgentById } from '@/db/functions/agent';
import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { dbGetAllActiveDataSourcesByUserId } from '@/db/functions/data-source-integrations';
import { summarizeConversationTitle } from '@/openai/text';
import { getUser } from '@/utils/auth';
import { streamText, type Message } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

import { myProvider } from './models';
import { allModelsSchema } from './schemas';
import { constructSystemPrompt } from './system-prompt';
import { fileSearchTool } from './tools/file-search';
import { generateImageTool } from './tools/generate-image';
import { getBarcaMatchesTool } from './tools/get-barca-matches';
import { searchNotionTool } from './tools/notion-search';
import { webSearchTool } from './tools/openai-search';
import { getActiveNotionIntegration, type AIModel } from './types';

export async function POST(request: NextRequest) {
  const user = await getUser();

  const {
    chatId,
    messages,
    modelId,
    agentId,
    webSearchActive,
  }: {
    chatId: string;
    messages: Message[];
    modelId: AIModel;
    agentId?: string;
    webSearchActive: boolean;
  } = await request.json();

  try {
    const parsedModelId = allModelsSchema.safeParse(modelId);

    if (!parsedModelId.success) {
      return NextResponse.json(
        { error: 'Invalid model ID provided. Please provide a valid model ID.' },
        { status: 400 },
      );
    }

    const validModelId = parsedModelId.data;

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
      metadata: { modelId: validModelId },
      orderNumber: messages.length,
    });

    const systemPrompt = constructSystemPrompt({
      agentInstructions: maybeAgent?.instructions,
      userCustomInstructions: user.settings?.customInstructions,
      webSearchActive,
    });

    const activeDataSources = await dbGetAllActiveDataSourcesByUserId({ userId: user.id });
    const notionDataSource = getActiveNotionIntegration(activeDataSources);

    const tools = {
      ...(maybeAgent !== undefined &&
        maybeAgent.vectorStoreId !== null && {
          searchFiles: fileSearchTool({ vectorStoreId: maybeAgent.vectorStoreId }),
        }),
      ...(webSearchActive && { searchTheWeb: webSearchTool() }),
      ...(!webSearchActive && { generateImage: generateImageTool() }),
      ...(!webSearchActive && { getBarcaMatches: getBarcaMatchesTool() }),
      ...(!webSearchActive &&
        notionDataSource !== undefined && {
          searchNotion: await searchNotionTool({ notionDataSource }),
        }),
    };

    const result = streamText({
      model: myProvider.languageModel(validModelId),
      system: systemPrompt,
      messages,
      maxSteps: 5,
      tools,
      async onFinish(assistantMessage) {
        await dbInsertChatContent({
          content: assistantMessage.text,
          role: 'assistant',
          userId: user.id,
          metadata: { modelId: validModelId },
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
