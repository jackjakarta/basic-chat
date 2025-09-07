import { dbGetEnabledImageModels, dbGetEnabledModelById } from '@/db/functions/ai-model';
import { dbGetAssistantById } from '@/db/functions/assistant';
import {
  dbGetOrCreateConversation,
  dbInsertChatContent,
  dbUpdateConversationTitle,
} from '@/db/functions/chat';
import { dbGetChatProjectById } from '@/db/functions/chat-project';
import { dbGetAllActiveDataSourcesByUserId } from '@/db/functions/data-source-integrations';
import { dbGetChatProjectFiles } from '@/db/functions/file';
import { dbGetAmountOfTokensUsedByUserId, dbInsertConversationUsage } from '@/db/functions/usage';
import { summarizeConversationTitle } from '@/openai/text';
import { getSubscriptionPlanBySubscriptionState } from '@/stripe/subscription';
import { getUser } from '@/utils/auth';
import { getUserMessage, getUserMessageAttachments } from '@/utils/chat';
import { smoothStream, streamText, type Message, type ToolSet } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

import { getModel } from './models';
import { getFullSystemPrompt } from './system-prompt';
// import { getExecuteCodeTool } from './tools/code-execution';
import { getAssistantFileSearchTool } from './tools/file-search';
import { getGenerateImageTool } from './tools/generate-image';
import { getBarcaMatchesTool } from './tools/get-barca-matches';
import { getActiveNotionIntegration, getSearchNotionTool } from './tools/notion-search';
import { getWebSearchTool } from './tools/openai-search';
import { getProjectFilesSearchTool } from './tools/project-files-search';

export async function POST(request: NextRequest) {
  const user = await getUser();

  try {
    const subscriptionPlan = await getSubscriptionPlanBySubscriptionState(user.subscription);

    if (subscriptionPlan === undefined) {
      return NextResponse.json(
        { error: 'Invalid subscription state. Please check your subscription.' },
        { status: 400 },
      );
    }

    const tokenUsed = await dbGetAmountOfTokensUsedByUserId({ userId: user.id });

    const { limits } = subscriptionPlan;
    const { totalTokens } = tokenUsed;

    if (limits.tokenLimit !== null && totalTokens >= limits.tokenLimit) {
      return NextResponse.json(
        { error: 'Token limit exceeded. Please upgrade your subscription.' },
        { status: 403 },
      );
    }

    const {
      chatId,
      messages,
      modelId,
      assistantId,
      chatProjectId,
      webSearchActive,
      imageGenerationActive,
    }: {
      chatId: string;
      messages: Message[];
      modelId: string;
      assistantId?: string;
      chatProjectId?: string;
      webSearchActive: boolean;
      imageGenerationActive: boolean;
    } = await request.json();

    const model = await dbGetEnabledModelById({ modelId });

    if (model === undefined) {
      return NextResponse.json(
        {
          error:
            'Invalid model ID provided. Please provide a valid model ID or enable it from the dashboard.',
        },
        { status: 400 },
      );
    }

    const [maybeAssistant, maybeChatProject, imageModels] = await Promise.all([
      assistantId !== undefined ? dbGetAssistantById({ assistantId, userId: user.id }) : undefined,
      chatProjectId !== undefined
        ? dbGetChatProjectById({ chatProjectId, userId: user.id })
        : undefined,
      dbGetEnabledImageModels(),
    ]);

    const chatProjectFiles =
      maybeChatProject !== undefined
        ? await dbGetChatProjectFiles({ chatProjectId: maybeChatProject.id, userId: user.id })
        : [];

    const chatProjectFileNames = chatProjectFiles.map((f) => f.name);

    const conversation = await dbGetOrCreateConversation({
      conversationId: chatId,
      userId: user.id,
      assistantId: maybeAssistant?.id,
      chatProjectId: maybeChatProject?.id,
    });

    if (conversation === undefined) {
      return NextResponse.json({ error: 'Could not get or create conversation' }, { status: 500 });
    }

    const activeDataSources = await dbGetAllActiveDataSourcesByUserId({ userId: user.id });
    const notionDataSource = getActiveNotionIntegration(activeDataSources);

    const [defaultImageModel] = imageModels;

    const tools: ToolSet = {
      ...(webSearchActive && !imageGenerationActive && { searchTheWeb: getWebSearchTool() }),
      // ...(!imageGenerationActive && { executeCode: getExecuteCodeTool() }),
      ...(!imageGenerationActive && { getBarcaMatches: getBarcaMatchesTool() }),
      ...(!imageGenerationActive &&
        maybeChatProject !== undefined && {
          searchProjectFiles: getProjectFilesSearchTool({
            userId: user.id,
            chatProjectId: maybeChatProject.id,
          }),
        }),
      ...(imageGenerationActive &&
        !webSearchActive && {
          generateImage: getGenerateImageTool({
            userEmail: user.email,
            userId: user.id,
            model: defaultImageModel,
          }),
        }),
      ...(!imageGenerationActive &&
        maybeAssistant !== undefined &&
        maybeAssistant.vectorStoreId !== null && {
          assistantSearchFiles: getAssistantFileSearchTool({
            vectorStoreId: maybeAssistant.vectorStoreId,
          }),
        }),
      ...(!imageGenerationActive &&
        notionDataSource !== undefined && {
          searchNotion: await getSearchNotionTool({ notionDataSource }),
        }),
    };

    const availableToolNames = Object.keys(tools);

    const systemPrompt = getFullSystemPrompt({
      assistantInstructions: maybeAssistant?.instructions,
      userCustomInstructions: user.settings?.customInstructions,
      webSearchActive,
      imageGenerationActive,
      chatProjectName: maybeChatProject?.name,
      chatProjectSystemPrompt: maybeChatProject?.systemPrompt ?? undefined,
      chatProjectFileNames,
      availableToolNames,
    });

    console.debug({ systemPrompt });

    const result = streamText({
      model: getModel(model),
      system: systemPrompt,
      messages,
      maxSteps: 5,
      experimental_transform: smoothStream({ delayInMs: 20 }),
      tools,
      async onFinish(assistantMessage) {
        const userMessage = getUserMessage(messages);
        const userMessageAttachments = getUserMessageAttachments(messages);

        await Promise.all([
          dbInsertChatContent({
            conversationId: conversation.id,
            content: userMessage ?? '',
            role: 'user',
            userId: user.id,
            attachments: userMessageAttachments,
            orderNumber: messages.length,
          }),

          dbInsertChatContent({
            conversationId: conversation.id,
            content: assistantMessage.text,
            role: 'assistant',
            userId: user.id,
            orderNumber: messages.length + 1,
            metadata: { modelId: model.id },
          }),
        ]);

        await dbInsertConversationUsage({
          conversationId: conversation.id,
          userId: user.id,
          modelId: model.id,
          promptTokens: assistantMessage.usage.promptTokens,
          completionTokens: assistantMessage.usage.completionTokens,
        });

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
