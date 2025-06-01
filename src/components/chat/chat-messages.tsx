'use client';

import { toolNameMap } from '@/utils/chat';
import { cw } from '@/utils/tailwind';
import { type Message } from 'ai';
import Image from 'next/image';

import LoadingText from '../common/loading-text';
import TTSButton from '../common/tts-button';
import ReloadIcon from '../icons/reload';
import CopyButton from './copy-button';
import DisplayCodeExecution from './display-code-execution';
import DisplayPdfFile from './display-pdf-file';
import DisplaySources from './display-sources';
import MarkdownDisplay from './markdown-display/markdown-display';
import { type ChatResponseStatus } from './types';
import { extractFileNameFromSignedUrl } from './utils';

type ChatMessagesProps = {
  messages: Message[];
  status: ChatResponseStatus;
  reload: () => void;
};

export default function ChatMessages({ messages, status, reload }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4 px-4">
      {messages.map((message, index) => {
        const isLastNonUser = index === messages.length - 1 && message.role !== 'user';
        const finishedAssistantMessage =
          message.role === 'assistant' && status !== 'submitted' && status !== 'streaming';

        const userImageAttachments =
          message.experimental_attachments?.filter((a) => a.type === 'image') ?? [];

        const userFileAttachments =
          message.experimental_attachments?.filter((a) => a.type === 'file') ?? [];

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
                  {userFileAttachments.length > 0 && (
                    <div className="flex items-center flex-wrap gap-x-2">
                      {userFileAttachments.map((attachment) => (
                        <DisplayPdfFile
                          key={attachment.id}
                          fileName={extractFileNameFromSignedUrl(attachment.name)}
                          className="w-[100px] bg-sidebar mb-4"
                        />
                      ))}
                    </div>
                  )}

                  {userImageAttachments.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {userImageAttachments.map((attachment) => (
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
  );
}
