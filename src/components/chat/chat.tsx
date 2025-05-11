'use client';

import { toolNameMap } from '@/utils/chat';
import { getTimeBasedGreeting } from '@/utils/greeting';
import { replaceUrl } from '@/utils/navigation';
import { cw } from '@/utils/tailwind';
import { useChat, type Message } from '@ai-sdk/react';
import { useQueryClient } from '@tanstack/react-query';
import { Globe2 } from 'lucide-react';
import React from 'react';

import AutoResizeTextarea from '../common/auto-resize-textarea';
import LoadingText from '../common/loading-text';
import { ButtonTooltip } from '../common/tooltip-button';
import TTSButton from '../common/tts-button';
import { useChatOptions } from '../hooks/use-chat-options';
import { useToast } from '../hooks/use-toast';
import ArrowRightIcon from '../icons/arrow-right';
import CheckIcon from '../icons/check';
import ClipboardIcon from '../icons/clipboard';
import ReloadIcon from '../icons/reload';
import StopIcon from '../icons/stop';
import { useLlmModel } from '../providers/llm-model';
import DisplaySources from './display-sources';
import MarkdownDisplay from './markdown-display/markdown-display';

type ChatProps = {
  id: string;
  initialMessages: Message[];
  userFirstName?: string;
  agentId?: string;
};

export default function Chat({ id, initialMessages, userFirstName, agentId }: ChatProps) {
  const { model: modelId } = useLlmModel();
  const { toastError } = useToast();
  const queryClient = useQueryClient();

  const [isWebSearchActive, setIsWebSearchActive] = React.useState(false);

  const { messages, input, handleInputChange, handleSubmit, status, reload, stop, error } = useChat(
    {
      id,
      initialMessages,
      api: '/api/chat',
      experimental_throttle: 100,
      maxSteps: 5,
      body: { chatId: id, modelId, agentId, webSearchActive: isWebSearchActive },
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

  function toggleWebSearch() {
    setIsWebSearchActive((prev) => !prev);
  }

  return (
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
        <div
          className={cw(
            'w-full max-w-[25rem] md:max-w-[30rem] lg:max-w-[42rem] px-4 -mt-14',
            messages.length > 0 ? 'fixed bottom-4' : '',
          )}
        >
          <div className="flex flex-col">
            <form
              onSubmit={customHandleSubmit}
              className="bg-sidebar w-full p-1 border focus-within:border-primary border-none rounded-xl"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <AutoResizeTextarea
                    autoFocus
                    placeholder="Type your message here..."
                    className="w-full text-base focus:outline-none bg-transparent max-h-[10rem] sm:max-h-[15rem] overflow-y-auto px-3 py-2"
                    onChange={handleInputChange}
                    value={input}
                    onKeyDown={handleSubmitOnEnter}
                    maxLength={20000}
                  />
                </div>
                <div className="flex items-center justify-between py-1 pl-3 -ml-1 mb-1">
                  <ButtonTooltip
                    tooltip={isWebSearchActive ? 'Deactivate web search' : 'Activate web search'}
                    tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
                    size="sm"
                    type="button"
                    className="py-1 transition-colors duration-200 ease-in-out "
                    variant={isWebSearchActive ? 'active' : 'neutral'}
                    onClick={toggleWebSearch}
                  >
                    <Globe2 className="h-4 w-4" />
                    Web Search
                  </ButtonTooltip>
                  {status === 'submitted' || status === 'streaming' ? (
                    <button
                      type="button"
                      title="Stop generating"
                      onClick={() => stop()}
                      className="p-1.5 flex items-center justify-center group disabled:cursor-not-allowed rounded-lg hover:bg-secondary/20 me-2"
                      aria-label="Stop"
                    >
                      <StopIcon className="w-6 h-6 text-dark-gray group-disabled:bg-gray-200 group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      title="Send message"
                      disabled={input.trim().length === 0}
                      className="flex items-center justify-center group text-secondary disabled:cursor-not-allowed rounded-lg hover:bg-secondary/20 me-2"
                      aria-label="Send Message"
                    >
                      <ArrowRightIcon className="w-7 h-7 text-dark-gray group-disabled:bg-secondary rounded-lg dark:group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                    </button>
                  )}
                </div>
              </div>
            </form>
            <span className="text-xs mt-2 font-normal text-main-900 flex self-center">
              This chat can search the web and generate images
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
