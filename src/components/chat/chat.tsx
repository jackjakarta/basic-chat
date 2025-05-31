'use client';

import { type AIModelRow } from '@/db/schema';
import { ImageFile, SuccessLocalFileState, type LocalFileState } from '@/types/files';
import { toolNameMap } from '@/utils/chat';
import { getTimeBasedGreeting } from '@/utils/greeting';
import { replaceUrl } from '@/utils/navigation';
import { cw } from '@/utils/tailwind';
import { generateUUID } from '@/utils/uuid';
import { useChat, type Message } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { Attachment } from 'ai';
import Image from 'next/image';
import React from 'react';

import Header from '../common/header';
import LoadingText from '../common/loading-text';
import TTSButton from '../common/tts-button';
import { useChatOptions } from '../hooks/use-chat-options';
import { useToast } from '../hooks/use-toast';
import CheckIcon from '../icons/check';
import ClipboardIcon from '../icons/clipboard';
import ReloadIcon from '../icons/reload';
import { useLlmModel } from '../providers/llm-model';
import ChatInput from './chat-input';
import CopyButton from './copy-button';
import DisplayCodeExecution from './display-code-execution';
import DisplaySources from './display-sources';
import MarkdownDisplay from './markdown-display/markdown-display';

type ChatProps = {
  id: string;
  initialMessages: Message[];
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

  const { scrollRef } = useChatOptions({ messages });
  const chatPath = agentId !== undefined ? `/agents/${agentId}/c/${id}` : `/c/${id}`;

  function refetchConversations() {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }

  function customHandleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFiles(new Map());

    try {
      handleSubmit(e, { experimental_attachments: imageAttachments });
      replaceUrl(chatPath);
    } catch (error) {
      console.error({ error });
      toastError('Failed to send message');
    }
  }

  const chatDisabled = tokensUsed >= 18000;

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
                <div className="flex flex-col gap-4 px-4">
                  {messages.map((message, index) => {
                    const isLastNonUser = index === messages.length - 1 && message.role !== 'user';
                    const finishedAssistantMessage =
                      message.role === 'assistant' &&
                      status !== 'submitted' &&
                      status !== 'streaming';

                    const userimageAttachments =
                      message.experimental_attachments?.filter((a) => a.type === 'image') ?? [];

                    return (
                      <div
                        key={index}
                        className={cw(
                          'w-fit text-secondary-foreground',
                          message.role === 'user' &&
                            'p-4 rounded-2xl rounded-br-none self-end bg-sidebar-accent text-secondary-foreground max-w-[70%] break-words',
                        )}
                      >
                        <div>
                          {message.content.length > 0 && status !== 'error' ? (
                            <>
                              {userimageAttachments.length > 0 && (
                                <div className="flex flex-col gap-2">
                                  {userimageAttachments.map((attachment) => (
                                    <Image
                                      key={attachment.id}
                                      src={attachment.url}
                                      alt={`logo-${attachment.id}`}
                                      width={300}
                                      height={300}
                                      className="rounded-lg h-[300px] w-[300px] object-cover mb-4"
                                    />
                                  ))}
                                </div>
                              )}

                              <MarkdownDisplay maxWidth={700}>{message.content}</MarkdownDisplay>
                              <DisplayCodeExecution message={message} status={status} />
                              <DisplaySources message={message} status={status} />
                            </>
                          ) : (
                            <LoadingText>
                              {toolNameMap(
                                message?.parts?.[0]?.type === 'tool-invocation'
                                  ? message.parts?.[0].toolInvocation.toolName
                                  : '',
                              ) ?? ''}
                            </LoadingText>
                          )}

                          {finishedAssistantMessage && (
                            <div
                              className={cw(
                                'flex items-center gap-1 hover:opacity-100',
                                isLastNonUser ? 'opacity-100' : 'opacity-0',
                              )}
                            >
                              <CopyButton text={message.content} index={index} />
                              <TTSButton
                                text={message.content}
                                className={cw(
                                  'mt-1 p-2 rounded-md hover:bg-secondary/65',
                                  'text-primary dark:text-sidebar-accent',
                                )}
                                iconClassName="w-3.5 h-3.5"
                              />
                              {isLastNonUser && (
                                <button
                                  title="Reload last message"
                                  type="button"
                                  onClick={() => reload()}
                                  className="mt-1"
                                  aria-label="Reload"
                                >
                                  <div
                                    className={cw(
                                      'p-2 rounded-md hover:bg-secondary/65',
                                      'text-primary dark:text-sidebar-accent',
                                    )}
                                  >
                                    <ReloadIcon className="w-3.5 h-3.5" />
                                  </div>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {status === 'submitted' && (
                  <span className="w-fit text-secondary-foreground px-4 animate-pulse">
                    Loading...
                  </span>
                )}
              </>
            )}
            {status === 'error' && (
              <div className="mx-4 p-4 gap-2 text-sm rounded-2xl bg-red-100 text-red-500 border border-red-500 text-right mt-8">
                <div className="flex justify-between items-center px-2">
                  {error?.message ?? 'Something went wrong'}
                  <button
                    onClick={() => reload()}
                    type="button"
                    className="hover:bg-red-200 p-2 rounded-lg"
                  >
                    <ReloadIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <ChatInput
            messages={messages}
            customHandleSubmit={customHandleSubmit}
            imageAttachments={imageAttachments}
            handleInputChange={handleInputChange}
            input={input}
            setFiles={setFiles}
            status={status}
            isWebSearchActive={isWebSearchActive}
            setIsWebSearchActive={setIsWebSearchActive}
            isImageGenerationActive={isImageGenerationActive}
            setIsImageGenerationActive={setIsImageGenerationActive}
            chatDisabled={chatDisabled}
            stop={stop}
          />
        </div>
      </div>
    </>
  );
}
