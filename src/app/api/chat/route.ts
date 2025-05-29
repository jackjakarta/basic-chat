import { dbGetAgentById } from '@/db/functions/agent';
import { dbGetModelById } from '@/db/functions/ai-model';
import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { dbGetAllActiveDataSourcesByUserId } from '@/db/functions/data-source-integrations';
import { dbInsertConversationUsage } from '@/db/functions/usage';
import { summarizeConversationTitle } from '@/openai/text';
import { getUser } from '@/utils/auth';
import { getUserMessage, getUserMessageAttachments } from '@/utils/chat';
import { smoothStream, streamText, type Message } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

import { getModel } from './models';
import { constructSystemPrompt } from './system-prompt';
import { executeCodeTool } from './tools/code-execution';
import { fileSearchTool } from './tools/file-search';
import { generateImageTool } from './tools/generate-image';
import { getBarcaMatchesTool } from './tools/get-barca-matches';
import { getActiveNotionIntegration, searchNotionTool } from './tools/notion-search';
import { webSearchTool } from './tools/openai-search';

export async function POST(request: NextRequest) {
  const user = await getUser();

  const {
    chatId,
    messages,
    modelId,
    agentId,
    webSearchActive,
    imageGenerationActive,
  }: {
    chatId: string;
    messages: Message[];
    modelId: string;
    agentId?: string;
    webSearchActive: boolean;
    imageGenerationActive: boolean;
  } = await request.json();

  try {
    const model = await dbGetModelById({ modelId });

    if (model === undefined) {
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

    const userMessage = getUserMessage(messages);
    const userMessageAttachments = getUserMessageAttachments(messages);

    await dbInsertChatContent({
      conversationId: conversation.id,
      content: userMessage ?? '',
      role: 'user',
      userId: user.id,
      attachments: userMessageAttachments,
      orderNumber: messages.length,
    });

    const systemPrompt = constructSystemPrompt({
      agentInstructions: maybeAgent?.instructions,
      userCustomInstructions: user.settings?.customInstructions,
      webSearchActive,
      imageGenerationActive,
    });

    const activeDataSources = await dbGetAllActiveDataSourcesByUserId({ userId: user.id });
    const notionDataSource = getActiveNotionIntegration(activeDataSources);

    const tools = {
      ...(webSearchActive && !imageGenerationActive && { searchTheWeb: webSearchTool() }),
      ...(!imageGenerationActive && { executeCode: executeCodeTool() }),
      ...(!imageGenerationActive && { getBarcaMatches: getBarcaMatchesTool() }),
      ...(imageGenerationActive &&
        !webSearchActive && { generateImage: generateImageTool({ userEmail: user.email }) }),
      ...(!imageGenerationActive &&
        maybeAgent !== undefined &&
        maybeAgent.vectorStoreId !== null && {
          searchFiles: fileSearchTool({ vectorStoreId: maybeAgent.vectorStoreId }),
        }),
      ...(!imageGenerationActive &&
        notionDataSource !== undefined && {
          searchNotion: await searchNotionTool({ notionDataSource }),
        }),
    };

    const result = streamText({
      model: getModel(model),
      system: systemPrompt,
      messages,
      maxSteps: 5,
      experimental_transform: smoothStream({ delayInMs: 20 }),
      tools,
      async onFinish(assistantMessage) {
        await Promise.all([
          dbInsertChatContent({
            content: assistantMessage.text,
            role: 'assistant',
            userId: user.id,
            metadata: { modelId: model.id },
            orderNumber: messages.length + 1,
            conversationId: conversation.id,
          }),

          dbInsertConversationUsage({
            conversationId: conversation.id,
            userId: user.id,
            modelId: model.id,
            promptTokens: assistantMessage.usage.promptTokens,
            completionTokens: assistantMessage.usage.completionTokens,
          }),
        ]);

        if (messages.length <= 2 || conversation.name === null) {
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
