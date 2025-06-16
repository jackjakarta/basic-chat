'use client';

import { type LocalFileState } from '@/types/files';
import { cw } from '@/utils/tailwind';
import { type Attachment, type Message } from 'ai';
import { ArrowUp, Globe2, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import AutoResizeTextarea from '../common/auto-resize-textarea';
import { ButtonTooltip } from '../common/tooltip-button';
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
  stop: () => void;
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
  stop,
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
        'w-full max-w-[25rem] md:max-w-[30rem] lg:max-w-[42rem] px-4 -mt-14',
        messages.length > 0 && 'fixed bottom-4',
      )}
    >
      <div className="flex flex-col">
        <form
          onSubmit={customHandleSubmit}
          className="bg-sidebar w-full p-1 border focus-within:border-primary border-none rounded-xl"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center ml-2 gap-2">
              {imageAttachments.map((f) => (
                <div
                  key={f.id}
                  className="relative cursor-pointer group"
                  onClick={() => handleDeattachFile(f.id)}
                >
                  <Image
                    src={f.url}
                    alt={`logo-${f.id}`}
                    width={60}
                    height={60}
                    className="my-2 group-hover:opacity-50 rounded-lg h-[60px]"
                  />
                  <div className="absolute invisible group-hover:visible top-6 right-4 text-muted-foreground rounded-full p-1">
                    <X className="w-5 h-5" />
                  </div>
                </div>
              ))}
              {fileAttachments.map((f) => (
                <div
                  key={f.id}
                  className="relative cursor-pointer group"
                  onClick={() => handleDeattachFile(f.id)}
                >
                  <DisplayPdfFile
                    fileName={extractFileNameFromSignedUrl(f.name) ?? undefined}
                    className="my-2 group-hover:opacity-50"
                  />
                  <div className="absolute invisible group-hover:visible top-4 right-4 text-muted-foreground rounded-full p-1">
                    <X className="w-5 h-5" />
                  </div>
                </div>
              ))}

              {isUploading && (
                <div className="flex justify-center items-center w-[60px] h-[60px]">
                  <SpinnerLoading className="w-6 h-6" />
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
                className="w-full text-base focus:outline-none bg-transparent max-h-[10rem] sm:max-h-[15rem] overflow-y-auto px-3 py-2 disabled:cursor-not-allowed"
                onChange={handleInputChange}
                value={input}
                onKeyDown={handleSubmitOnEnter}
                maxLength={20000}
              />
            </div>
            <div className="flex items-center justify-between py-1 pl-3 -ml-1 mb-1">
              <div className="flex items-center gap-2">
                <UploadButton
                  setFiles={setFiles}
                  setIsUploading={setIsUploading}
                  disabled={chatDisabled}
                />
                <ButtonTooltip
                  tooltip={isWebSearchActive ? 'Deactivate web search' : 'Activate web search'}
                  tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
                  size="sm"
                  type="button"
                  className="py-1 transition-colors duration-200 ease-in-out "
                  variant={isWebSearchActive ? 'active' : 'neutral'}
                  onClick={toggleWebSearch}
                  disabled={chatDisabled}
                >
                  <Globe2 className="h-4 w-4" />
                  Web Search
                </ButtonTooltip>
                <ButtonTooltip
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
                </ButtonTooltip>
              </div>
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
                  <ArrowUp className="w-7 h-7 text-dark-gray group-disabled:bg-secondary rounded-lg dark:group-disabled:text-gray-100 rounded-enterprise-sm text-primary group-hover:bg-secondary/20 " />
                </button>
              )}
            </div>
          </div>
        </form>
        <span className="text-xs mt-2 font-normal text-main-900 flex self-center">
          {chatDisabled
            ? 'You have reach your limit for the month. Buy a plan to get higher limits.'
            : 'This chat can search the web and generate images'}
        </span>
      </div>
    </div>
  );
}
