'use client';

import { type LocalFileState } from '@/types/files';
import { cw } from '@/utils/tailwind';
import { type Attachment, type Message } from 'ai';
import { ArrowUp, Globe2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import AutoResizeTextarea from '../common/auto-resize-textarea';
import { TooltipButton } from '../common/tooltip-button';
import SpinnerLoading from '../icons/animated/spinner';
import StopIcon from '../icons/stop';
import DisplayPdfFile from './display-pdf-file';
import { type ChatResponseStatus } from './types';
import UploadButton from './upload-button';
import { extractFileNameFromSignedUrl } from './utils';

type ChatInputProps = {
  messages: Message[];
  customHandleSubmit: (e: React.FormEvent) => void;
  imageAttachments: Attachment[];
  fileAttachments: Attachment[];
  handleInputChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  input: string;
  setFiles: React.Dispatch<React.SetStateAction<Map<string, LocalFileState>>>;
  isWebSearchActive: boolean;
  setIsWebSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
  isImageGenerationActive: boolean;
  setIsImageGenerationActive: React.Dispatch<React.SetStateAction<boolean>>;
  status: ChatResponseStatus;
  chatDisabled: boolean;
  onStop: () => void;
  chatProjectId?: string;
};

export default function ChatInput({
  messages,
  customHandleSubmit,
  imageAttachments,
  fileAttachments,
  handleInputChange,
  input,
  setFiles,
  isWebSearchActive,
  setIsWebSearchActive,
  isImageGenerationActive,
  setIsImageGenerationActive,
  status,
  chatDisabled,
  onStop,
  chatProjectId,
}: ChatInputProps) {
  const [isUploading, setIsUploading] = React.useState(false);

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

    if (!isWebSearchActive) {
      setIsImageGenerationActive(false);
    }
  }

  function toggleImageGeneration() {
    setIsImageGenerationActive((prev) => !prev);

    if (!isImageGenerationActive) {
      setIsWebSearchActive(false);
    }
  }

  function handleDeattachFile(fileId: string) {
    setFiles((prev) => {
      const next = new Map(prev);
      next.delete(fileId);
      return next;
    });
  }

  return (
    <div
      className={cw(
        '-mt-14 w-full max-w-[25rem] px-4 md:max-w-[30rem] lg:max-w-[42rem]',
        (messages.length > 0 || chatProjectId !== undefined) && 'fixed bottom-4',
      )}
    >
      <div className="flex flex-col">
        <form
          onSubmit={customHandleSubmit}
          className="w-full rounded-xl border border-none bg-sidebar p-1 focus-within:border-primary"
        >
          <div className="flex flex-col gap-1">
            <div className="ml-2 flex items-center gap-2">
              {imageAttachments.map((f) => (
                <div
                  key={f.id}
                  className="group relative cursor-pointer"
                  onClick={() => handleDeattachFile(f.id)}
                >
                  <Image
                    src={f.url}
                    alt={`logo-${f.id}`}
                    width={60}
                    height={60}
                    className="my-2 h-[60px] rounded-lg group-hover:opacity-50"
                  />
                  <div className="invisible absolute right-4 top-6 rounded-full p-1 text-muted-foreground group-hover:visible">
                    <X className="h-5 w-5" />
                  </div>
                </div>
              ))}
              {fileAttachments.map((f) => (
                <div
                  key={f.id}
                  className="group relative cursor-pointer"
                  onClick={() => handleDeattachFile(f.id)}
                >
                  <DisplayPdfFile
                    fileName={extractFileNameFromSignedUrl(f.name) ?? undefined}
                    className="my-2 group-hover:opacity-50"
                  />
                  <div className="invisible absolute right-4 top-4 rounded-full p-1 text-muted-foreground group-hover:visible">
                    <X className="h-5 w-5" />
                  </div>
                </div>
              ))}

              {isUploading && (
                <div className="flex h-[60px] w-[60px] items-center justify-center">
                  <SpinnerLoading className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <AutoResizeTextarea
                disabled={chatDisabled}
                autoFocus
                placeholder={
                  isImageGenerationActive
                    ? 'Describe an image...'
                    : isWebSearchActive
                      ? 'Search the web...'
                      : 'Ask anything...'
                }
                className="max-h-[10rem] w-full overflow-y-auto bg-transparent px-3 py-2 text-base focus:outline-none disabled:cursor-not-allowed sm:max-h-[15rem]"
                onChange={handleInputChange}
                value={input}
                onKeyDown={handleSubmitOnEnter}
                maxLength={20000}
              />
            </div>
            <div className="-ml-1 mb-1 flex items-center justify-between py-1 pl-3">
              <div className="flex items-center gap-2">
                <UploadButton
                  setFiles={setFiles}
                  setIsUploading={setIsUploading}
                  chatProjectId={chatProjectId}
                  disabled={chatDisabled}
                />
                <TooltipButton
                  tooltip={isWebSearchActive ? 'Deactivate web search' : 'Activate web search'}
                  tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
                  size="sm"
                  type="button"
                  className="py-1 transition-colors duration-200 ease-in-out"
                  variant={isWebSearchActive ? 'active' : 'neutral'}
                  onClick={toggleWebSearch}
                  disabled={chatDisabled}
                >
                  <Globe2 className="h-4 w-4" />
                  Web Search
                </TooltipButton>
                <TooltipButton
                  tooltip={
                    isImageGenerationActive
                      ? 'Deactivate image generation'
                      : 'Activate image generation'
                  }
                  tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
                  size="sm"
                  type="button"
                  className="py-1 transition-colors duration-200 ease-in-out disabled:cursor-not-allowed"
                  variant={isImageGenerationActive ? 'active' : 'neutral'}
                  onClick={toggleImageGeneration}
                  disabled={chatDisabled}
                >
                  <ImageIcon className="h-4 w-4" />
                  Image Generation
                </TooltipButton>
              </div>
              {status === 'submitted' || status === 'streaming' ? (
                <button
                  type="button"
                  title="Stop generating"
                  onClick={() => onStop()}
                  className="group me-2 flex items-center justify-center rounded-lg p-1.5 hover:bg-secondary/20 disabled:cursor-not-allowed"
                  aria-label="Stop"
                >
                  <StopIcon className="text-dark-gray h-6 w-6 text-primary group-hover:bg-secondary/20 group-disabled:bg-gray-200 group-disabled:text-gray-100" />
                </button>
              ) : (
                <button
                  type="submit"
                  title="Send message"
                  disabled={input.trim().length === 0}
                  className="group me-2 flex items-center justify-center rounded-lg text-secondary hover:bg-secondary/20 disabled:cursor-not-allowed"
                  aria-label="Send Message"
                >
                  <ArrowUp className="text-dark-gray h-7 w-7 rounded-lg text-primary group-hover:bg-secondary/20 group-disabled:bg-secondary dark:group-disabled:text-gray-100" />
                </button>
              )}
            </div>
          </div>
        </form>
        {messages.length === 0 && (
          <span className="text-main-900 mt-2 flex self-center text-xs font-normal">
            {chatDisabled
              ? 'You have reach your limit for the month. Buy a plan to get higher limits.'
              : 'This chat can search the web and generate images'}
          </span>
        )}
      </div>
    </div>
  );
}
