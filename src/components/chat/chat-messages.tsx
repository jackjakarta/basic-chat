'use client';

import { cw } from '@/utils/tailwind';
import { type Message } from 'ai';
import Image from 'next/image';

import TTSButton from '../common/tts-button';
import ReloadIcon from '../icons/reload';
import CopyButton from './copy-button';
import DisplayCodeExecution from './display-code-execution';
import DisplayPdfFile from './display-pdf-file';
import DisplaySources from './display-sources';
import LoadingTool from './loading-tool';
import MarkdownDisplay from './markdown-display/markdown-display';
import { type ChatResponseStatus } from './types';
import { extractFileNameFromSignedUrl } from './utils';

type ChatMessagesProps = {
  messages: Message[];
  status: ChatResponseStatus;
  onReload: () => void;
};

export default function ChatMessages({ messages, status, onReload }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-16">
      {messages.map((message, index) => {
        const isLastNonUser = index === messages.length - 1 && message.role !== 'user';
        const isAssistantFinished =
          message.role === 'assistant' && status !== 'submitted' && status !== 'streaming';

        const userImageAttachments =
          message.experimental_attachments?.filter((a) => a.type === 'image') ?? [];

        const userFileAttachments =
          message.experimental_attachments?.filter((a) => a.type === 'file') ?? [];

        return (
          <div key={index} className="flex flex-col gap-2">
            {userFileAttachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 self-end">
                {userFileAttachments.map((attachment) => (
                  <DisplayPdfFile
                    key={attachment.id}
                    fileName={extractFileNameFromSignedUrl(attachment.name)}
                    className="w-[100px] bg-sidebar"
                  />
                ))}
              </div>
            )}

            {userImageAttachments.length > 0 && (
              <div className="flex flex-col gap-2 self-end">
                {userImageAttachments.map((attachment) => (
                  <Image
                    key={attachment.id}
                    src={attachment.url}
                    alt={`logo-${attachment.id}`}
                    width={300}
                    height={300}
                    className="h-[300px] w-[300px] rounded-lg bg-sidebar object-cover"
                  />
                ))}
              </div>
            )}

            <div
              className={cw(
                'w-fit text-secondary-foreground',
                message.role === 'user' &&
                  'max-w-[70%] self-end break-words rounded-2xl rounded-br-none bg-sidebar-accent p-4 text-secondary-foreground',
              )}
            >
              <div>
                {message.content.length > 0 && status !== 'error' ? (
                  <>
                    <MarkdownDisplay maxWidth={700}>{message.content}</MarkdownDisplay>
                    <DisplayCodeExecution message={message} status={status} />
                    <DisplaySources message={message} status={status} />
                  </>
                ) : (
                  <LoadingTool message={message} />
                )}

                {isAssistantFinished && (
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
                        'mt-1 rounded-md p-2 hover:bg-secondary/65',
                        'text-primary dark:text-sidebar-accent',
                      )}
                      iconClassName="size-3.5"
                    />
                    {isLastNonUser && (
                      <button
                        type="button"
                        title="Reload last message"
                        onClick={() => onReload()}
                        className="mt-1"
                        aria-label="Reload"
                      >
                        <div
                          className={cw(
                            'rounded-md p-2 hover:bg-secondary/65',
                            'text-primary dark:text-sidebar-accent',
                          )}
                        >
                          <ReloadIcon className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
