'use client';

import { deleteLastMessageForReload } from '@/app/(app)/(chat)/c/[chatId]/actions';
import { cw } from '@/utils/tailwind';
import { generateUUID } from '@/utils/uuid';
import { useChat, type Message } from '@ai-sdk/react';
import React from 'react';

import AutoResizeTextarea from '../common/auto-resize-textarea';
import ArrowRightIcon from '../icons/arrow-right';
import CheckIcon from '../icons/check';
import ClipboardIcon from '../icons/clipboard';
import ReloadIcon from '../icons/reload';
import StopIcon from '../icons/stop';
import MarkdownDisplay from './markdown-display/markdown-display';

type ChatProps = {
  id: string;
  initialMessages: Message[];
};

export default function Chat({ id, initialMessages }: ChatProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  const { messages, input, handleInputChange, handleSubmit, status, reload, stop, error } = useChat(
    {
      id,
      initialMessages,
      api: '/api/chat',
      experimental_throttle: 100,
      maxSteps: 2,
      body: { id, modelId: 'gpt-4o' },
      generateId: generateUUID,
    },
  );

  const waitingForResponse = status === 'submitted' || status === 'streaming';

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  async function customHandleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      handleSubmit(e, {});

      window.history.replaceState({}, '', `/c/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitOnEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !waitingForResponse && !e.shiftKey) {
      e.preventDefault();
      if (e.currentTarget.value.trim().length > 0) {
        await customHandleSubmit(e);
      }
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  async function handleReload() {
    await deleteLastMessageForReload({ messageId: messages[messages.length - 1]?.id });
    reload();
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex flex-col flex-1 justify-between items-center w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-grow w-full max-w-[50rem] overflow-y-auto p-4 pb-[5rem]"
          style={{ maxHeight: 'calc(100vh - 150px)' }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">MY LOGO HERE</div>
          ) : (
            <>
              <div className="flex flex-col gap-4 px-4">
                {messages.map((message, index) => {
                  const isLastNonUser = index === messages.length - 1 && message.role !== 'user';

                  return (
                    <div
                      key={index}
                      className={cw(
                        'w-fit text-secondary-foreground',
                        message.role === 'user' &&
                          'p-4 rounded-2xl rounded-br-none self-end bg-primary text-primary-foreground max-w-[70%] break-words',
                      )}
                    >
                      <div className="">
                        <MarkdownDisplay maxWidth={600}>{message.content}</MarkdownDisplay>

                        {isLastNonUser && !waitingForResponse && (
                          <div className="flex items-center gap-1">
                            <button
                              title="Copy message"
                              type="button"
                              onClick={() => handleCopy(message.content)}
                              className="rounded-full hover:text-primary mt-1"
                              aria-label="Copy"
                            >
                              {isCopied ? (
                                <div className="p-2 rounded-enterprise-sm hover:bg-primary/20 rounded-md">
                                  <CheckIcon className="text-primary w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="p-2 rounded-enterprise-sm hover:bg-primary/20 rounded-md">
                                  <ClipboardIcon className="text-primary w-3.5 h-3.5" />
                                </div>
                              )}
                            </button>
                            <button
                              title="Reload last message"
                              type="button"
                              onClick={handleReload}
                              className="mt-1"
                              aria-label="Reload"
                            >
                              <div className="p-2 rounded-enterprise-sm hover:bg-primary/20 rounded-md">
                                <ReloadIcon className="text-primary w-3.5 h-3.5" />
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {status === 'submitted' && <span>Loading...</span>}
            </>
          )}
          {error && (
            <div className="mx-4 p-4 gap-2 text-sm rounded-2xl bg-red-100 text-red-500 border border-red-500 text-right mt-8">
              <div className="flex justify-between items-center px-2">
                {error.message || 'Etawas ist schiefgelaufen'}
                <button
                  onClick={handleReload}
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
              className="bg-white w-full p-1 border focus-within:border-primary rounded-xl"
            >
              <div className="flex items-center">
                <AutoResizeTextarea
                  autoFocus
                  placeholder="Type your message here..."
                  className="w-full text-base focus:outline-none bg-transparent max-h-[10rem] sm:max-h-[15rem] overflow-y-auto placeholder-black p-2"
                  onChange={handleInputChange}
                  value={input}
                  onKeyDown={handleSubmitOnEnter}
                  maxLength={20000}
                />
                {waitingForResponse ? (
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
                    <ArrowRightIcon className="w-9 h-9 text-dark-gray group-disabled:bg-gray-200 group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                  </button>
                )}
              </div>
            </form>
            <span className="text-xs mt-2 font-normal text-main-900 flex self-center">
              Press <kbd className="mx-2 text-xs bg-gray-100 rounded-md p-0.5">Enter</kbd> to send
              message
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
