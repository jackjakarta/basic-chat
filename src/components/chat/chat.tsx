'use client';

import { type AIModelRow, type SubscriptionLimits } from '@/db/schema';
import { FileFile, ImageFile, SuccessLocalFileState, type LocalFileState } from '@/types/files';
import { getTimeBasedGreeting } from '@/utils/greeting';
import { replaceUrl } from '@/utils/navigation';
import { cw } from '@/utils/tailwind';
import { generateUUID } from '@/utils/uuid';
import { useChat, type Message } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { Attachment } from 'ai';
import React from 'react';

import Header from '../common/header';
import { useChatOptions } from '../hooks/use-chat-options';
import { useToast } from '../hooks/use-toast';
import { useLlmModel } from '../providers/llm-model';
import ChatInput from './chat-input';
import ChatMessages from './chat-messages';
import ErrorDisplay from './error-display';
import LoadingDisplay from './loading-display';

type ChatProps = {
  id: string;
  initialMessages: Message[];
  userLimits: SubscriptionLimits;
  userFirstName?: string;
  models: AIModelRow[];
  tokensUsed: number;
  agentId?: string;
  agentName?: string;
};

export default function Chat({
  id,
  initialMessages,
  userFirstName,
  models,
  agentId,
  tokensUsed,
  userLimits,
  agentName,
}: ChatProps) {
  const queryClient = useQueryClient();

  const { model: modelId } = useLlmModel();
  const { toastError } = useToast();

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
        agentId,
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
          (f): f is SuccessLocalFileState & { file: ImageFile } =>
            f.status === 'success' && f.file.type === 'image',
        )
        .map((image) => ({
          name: image.file.imageUrl ?? '',
          url: image.file.imageUrl ?? '',
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
          (f): f is SuccessLocalFileState & { file: FileFile } =>
            f.status === 'success' && f.file.type === 'file',
        )
        .map((file) => ({
          name: file.file.imageUrl ?? '',
          url: file.file.imageUrl ?? '',
          contentType: 'application/pdf',
          type: 'file',
          id: file.id,
        })),
    [files],
  );

  function refetchConversations() {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }

  const chatPath = agentId !== undefined ? `/agents/${agentId}/c/${id}` : `/c/${id}`;

  function customHandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFiles(new Map());

    try {
      handleSubmit(e, { experimental_attachments: [...imageAttachments, ...fileAttachments] });
      replaceUrl(chatPath);
    } catch (error) {
      console.error({ error });
      toastError('Failed to send message');
    }
  }

  const tokenLimit = userLimits.tokenLimit ?? 0;
  const hasReachedLimit = tokenLimit > 0 && tokensUsed >= tokenLimit;

  return (
    <>
      <Header title={agentName} models={models} isEmptyChat={messages.length <= 0} />
      <div
        ref={scrollRef}
        className="flex flex-col h-full w-full overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 150px)' }}
      >
        <div className="flex flex-col flex-1 justify-center items-center w-full">
          <div
            className={cw('w-full max-w-[50rem] p-4 pb-[5rem]', messages.length > 0 && 'flex-grow')}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                {userFirstName && (
                  <h1 className="text-3xl font-normal text-primary dark:text-primary-foreground">
                    {getTimeBasedGreeting(userFirstName)}
                  </h1>
                )}
              </div>
            ) : (
              <>
                <ChatMessages messages={messages} status={status} reload={reload} />
                {status === 'submitted' && <LoadingDisplay />}
              </>
            )}
            {status === 'error' && <ErrorDisplay reload={reload} error={error} />}
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
            stop={stop}
          />
        </div>
      </div>
    </>
  );
}
