'use client';

import { replaceUrl } from '@/utils/navigation';
import { cw } from '@/utils/tailwind';
import { useChat, type Message } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import AutoResizeTextarea from '../common/auto-resize-textarea';
import LoadingText from '../common/loading-text';
import TTSButton from '../common/tts-button';
import { useChatOptions } from '../hooks/use-chat-options';
import { useToast } from '../hooks/use-toast';
import ArrowRightIcon from '../icons/arrow-right';
import CheckIcon from '../icons/check';
import ClipboardIcon from '../icons/clipboard';
import ChatLogoIcon from '../icons/logo';
import ReloadIcon from '../icons/reload';
import StopIcon from '../icons/stop';
import { useLlmModel } from '../providers/llm-model';
import DisplaySources from './display-sources';
import MarkdownDisplay from './markdown-display/markdown-display';
import { toolNameMap } from './utils';

type ChatProps = {
  id: string;
  initialMessages: Message[];
  agentId?: string;
};

export default function Chat({ id, initialMessages, agentId }: ChatProps) {
  const { model } = useLlmModel();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const { messages, input, handleInputChange, handleSubmit, status, reload, stop, error } = useChat(
    {
      id,
      initialMessages,
      api: '/api/chat',
      experimental_throttle: 100,
      maxSteps: 5,
      body: { chatId: id, modelId: model, agentId },
      onResponse: () => {
        if (messages.length > 1) {
          return;
        }

        refetchConversations();
      },
      onFinish: () => {
        if (messages.length > 1) {
          return;
        }

        refetchConversations();
      },
    },
  );

  const { scrollRef, copiedMessageIndex, handleCopy } = useChatOptions({ messages });
  const chatPath = agentId !== undefined ? `/agents/${agentId}/c/${id}` : `/c/${id}`;

  function refetchConversations() {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }

  function customHandleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      handleSubmit(e);
      replaceUrl(chatPath);
    } catch (error) {
      console.error({ error });
      toastError('Failed to send message');
    }
  }

  function handleSubmitOnEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && status !== 'submitted' && status !== 'streaming' && !e.shiftKey) {
      e.preventDefault();

      if (e.currentTarget.value.trim().length > 0) {
        customHandleSubmit(e);
      }
    }
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-col h-full w-full overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 150px)' }}
    >
      <div className="flex flex-col flex-1 justify-between items-center w-full">
        <div className="flex-grow w-full max-w-[50rem] p-4 pb-[5rem]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <ChatLogoIcon className="text-primary dark:text-secondary w-64 h-64" />
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
                            <MarkdownDisplay maxWidth={700}>{message.content}</MarkdownDisplay>
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
                            <button
                              title="Copy message"
                              type="button"
                              onClick={() => handleCopy(message.content, index)}
                              className="rounded-full mt-1 "
                              aria-label="Copy"
                            >
                              <div
                                className={cw(
                                  'p-2 rounded-md hover:bg-secondary/65',
                                  'text-primary hover:text-primary',
                                  'dark:text-sidebar-accent hover:dark:text-sidebar-accent',
                                )}
                              >
                                {copiedMessageIndex === index ? (
                                  <CheckIcon className="w-3.5 h-3.5" />
                                ) : (
                                  <ClipboardIcon className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </button>
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

        <div className="w-full fixed bottom-4 max-w-[25rem] md:max-w-[30rem] lg:max-w-[42rem] px-4">
          <div className="flex flex-col">
            <form
              onSubmit={customHandleSubmit}
              className="bg-sidebar w-full p-1 border focus-within:border-primary rounded-xl"
            >
              <div className="flex items-center">
                <AutoResizeTextarea
                  autoFocus
                  placeholder="Type your message here..."
                  className="w-full text-base focus:outline-none bg-transparent max-h-[10rem] sm:max-h-[15rem] overflow-y-auto p-2"
                  onChange={handleInputChange}
                  value={input}
                  onKeyDown={handleSubmitOnEnter}
                  maxLength={20000}
                />
                {status === 'submitted' || status === 'streaming' ? (
                  <button
                    type="button"
                    title="Stop generating"
                    onClick={() => stop()}
                    className="p-1.5 flex items-center justify-center group disabled:cursor-not-allowed rounded-enterprise-sm hover:bg-secondary/20 me-2"
                    aria-label="Stop"
                  >
                    <StopIcon className="w-6 h-6 text-dark-gray group-disabled:bg-gray-200 group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                  </button>
                ) : (
                  <button
                    type="submit"
                    title="Send message"
                    disabled={input.trim().length === 0}
                    className="flex items-center justify-center group disabled:cursor-not-allowed rounded-enterprise-sm hover:bg-secondary/20 me-2"
                    aria-label="Send Message"
                  >
                    <ArrowRightIcon className="w-7 h-7 text-dark-gray group-disabled:bg-primary rounded-lg group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                  </button>
                )}
              </div>
            </form>
            <span className="text-xs mt-2 font-normal text-main-900 flex self-center">
              Press{' '}
              <kbd className="mx-2 text-xs bg-gray-100 dark:bg-accent rounded-md px-2 py-0.5">
                Enter
              </kbd>{' '}
              to send message
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
