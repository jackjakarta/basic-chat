'use client';

import ConversationsDisplay from '@/app/(app)/(chat)/p/[chatProjectId]/conversations-display';
import ProjectFilesDisplay from '@/app/(app)/(chat)/p/[chatProjectId]/files-display';
import SystemPromptDialog from '@/app/(app)/(chat)/p/[chatProjectId]/system-prompt';
import {
  type AIModelRow,
  type ChatProjectRow,
  type FileRow,
  type SubscriptionLimits,
} from '@/db/schema';
import { type WithConversations } from '@/db/types';
import {
  type AttachmentFile,
  type LocalFileState,
  type SuccessLocalFileState,
} from '@/types/files';
import { getTimeBasedGreeting } from '@/utils/greeting';
import { replaceUrl } from '@/utils/navigation';
import { cw } from '@/utils/tailwind';
import { generateUUID } from '@/utils/uuid';
import { useChat, type Message } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { type Attachment } from 'ai';
import { useRouter } from 'next/navigation';
import React from 'react';

import Header from '../common/header';
import { useChatOptions } from '../hooks/use-chat-options';
import { useLlmModel } from '../providers/llm-model';
import ChatInput from './chat-input';
import ChatMessages from './chat-messages';
import ErrorDisplay from './error-display';
import LoadingDisplay from './loading-display';
import { buildConversationPath } from './utils';

type ChatProjectWithConversations = WithConversations<ChatProjectRow>;

type ChatProps = {
  id: string;
  initialMessages: Message[];
  userLimits: SubscriptionLimits;
  models: AIModelRow[];
  tokensUsed: number;
  userFirstName?: string;
  assistantId?: string;
  assistantName?: string;
  chatProject?: ChatProjectWithConversations;
  chatProjectFiles?: FileRow[];
};

export default function Chat({
  id,
  initialMessages,
  userLimits,
  models,
  tokensUsed,
  userFirstName,
  assistantId,
  assistantName,
  chatProject,
  chatProjectFiles = [],
}: ChatProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { model: modelId } = useLlmModel();

  const [isWebSearchActive, setIsWebSearchActive] = React.useState(false);
  const [isImageGenerationActive, setIsImageGenerationActive] = React.useState(false);
  const [files, setFiles] = React.useState<Map<string, LocalFileState>>(new Map());

  const { messages, input, handleInputChange, handleSubmit, status, reload, stop, error } = useChat(
    {
      id,
      initialMessages,
      api: '/api/chat',
      experimental_throttle: 100,
      maxSteps: 5,
      body: {
        chatId: id,
        modelId,
        assistantId,
        chatProjectId: chatProject?.id,
        webSearchActive: isWebSearchActive,
        imageGenerationActive: isImageGenerationActive,
      },
      generateId: generateUUID,
      sendExtraMessageFields: true,
      onResponse: () => {
        if (messages.length <= 1) {
          refetchConversations();
        }
      },
      onFinish: () => {
        if (messages.length <= 1) {
          refetchConversations();
          router.refresh();
        }
      },
    },
  );

  const { scrollRef } = useChatOptions({ messages });

  const imageAttachments = React.useMemo<Attachment[]>(
    () =>
      Array.from(files)
        .map(([, fileState]) => fileState)
        .filter(
          (f): f is SuccessLocalFileState & { file: AttachmentFile } =>
            f.status === 'success' && f.file.type === 'image',
        )
        .map((image) => ({
          name: image.file.signedUrl ?? '',
          url: image.file.signedUrl ?? '',
          contentType: 'image/png',
          type: 'image',
          id: image.id,
        })),
    [files],
  );

  const fileAttachments = React.useMemo<Attachment[]>(
    () =>
      Array.from(files)
        .map(([, fileState]) => fileState)
        .filter(
          (f): f is SuccessLocalFileState & { file: AttachmentFile } =>
            f.status === 'success' && f.file.type === 'file',
        )
        .map((file) => ({
          name: file.file.signedUrl ?? '',
          url: file.file.signedUrl ?? '',
          contentType: 'application/pdf',
          type: 'file',
          id: file.id,
        })),
    [files],
  );

  function refetchConversations() {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }

  const chatPath = buildConversationPath({
    chatProjectId: chatProject?.id,
    assistantId,
    chatId: id,
  });

  function customHandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFiles(new Map());

    try {
      handleSubmit(e, { experimental_attachments: [...imageAttachments, ...fileAttachments] });
      replaceUrl(chatPath);
    } catch (error) {
      console.error({ error });
    }
  }

  const { tokenLimit } = userLimits;
  const hasReachedLimit = tokenLimit !== null && tokensUsed >= tokenLimit;

  return (
    <>
      <Header
        assistantName={assistantName}
        chatProject={chatProject}
        models={models}
        isEmptyChat={messages.length === 0}
      />
      <div
        ref={scrollRef}
        className="flex h-full w-full flex-col overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 70px)' }}
      >
        <div
          className={cw(
            'flex w-full flex-1 flex-col items-center',
            messages.length === 0 && chatProject === undefined && 'justify-center',
          )}
        >
          <div
            className={cw('w-full max-w-[50rem] p-4 pb-[5rem]', messages.length > 0 && 'flex-grow')}
          >
            {messages.length === 0 ? (
              <EmptyChat
                chatProject={chatProject}
                userFirstName={userFirstName}
                chatProjectFiles={chatProjectFiles}
              />
            ) : (
              <>
                <ChatMessages messages={messages} status={status} onReload={reload} />
                {status === 'submitted' && <LoadingDisplay />}
              </>
            )}
            {status === 'error' && <ErrorDisplay error={error} onReload={reload} />}
          </div>

          <ChatInput
            messages={messages}
            customHandleSubmit={customHandleSubmit}
            imageAttachments={imageAttachments}
            fileAttachments={fileAttachments}
            handleInputChange={handleInputChange}
            input={input}
            setFiles={setFiles}
            status={status}
            isWebSearchActive={isWebSearchActive}
            setIsWebSearchActive={setIsWebSearchActive}
            isImageGenerationActive={isImageGenerationActive}
            setIsImageGenerationActive={setIsImageGenerationActive}
            chatDisabled={hasReachedLimit}
            onStop={stop}
            chatProjectId={chatProject?.id}
          />
        </div>
      </div>
    </>
  );
}

function EmptyChat({
  chatProject,
  userFirstName,
  chatProjectFiles,
}: {
  chatProject?: ChatProjectWithConversations;
  chatProjectFiles?: FileRow[];
  userFirstName?: string;
}) {
  if (chatProject === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        {userFirstName && (
          <h1 className="text-3xl font-normal text-primary dark:text-primary-foreground">
            {getTimeBasedGreeting(userFirstName)}
          </h1>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SystemPromptDialog
        chatProjectId={chatProject.id}
        currentSystemPrompt={chatProject.systemPrompt}
      />
      <ProjectFilesDisplay chatProjectId={chatProject.id} files={chatProjectFiles ?? []} />
      <ConversationsDisplay chatProjectId={chatProject.id} />
    </div>
  );
}
