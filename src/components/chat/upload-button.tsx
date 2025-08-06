'use client';

import { type LocalFileState } from '@/types/files';
import { Paperclip } from 'lucide-react';
import React from 'react';
import { z } from 'zod';

import { TooltipButton } from '../common/tooltip-button';
import { useToast } from '../hooks/use-toast';
import { useLlmModel } from '../providers/llm-model';

const uploadResponseSchema = z.object({
  fileId: z.string(),
  signedUrl: z.string(),
});

type UploadButtonProps = {
  setFiles: React.Dispatch<React.SetStateAction<Map<string, LocalFileState>>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
};

export default function UploadButton({ setFiles, setIsUploading, disabled }: UploadButtonProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toastError } = useToast();
  const { model: modelId } = useLlmModel();

  const canUploadFiles = modelId !== 'pixtral-large-latest' && modelId !== 'grok-2-vision-1212';
  const toolTipMessage = canUploadFiles ? 'images and pdfs' : 'images';

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;
    await handleFileUpload(file);
    e.target.value = '';
  }

  async function handleFileUpload(file: File) {
    setIsUploading(true);

    const endpoint = file.type.startsWith('image/') ? 'image' : 'file';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/chat-upload/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (response.status === 420) {
        toastError(`Only ${toolTipMessage} are supported with this model`);
        return;
      }

      if (response.status === 413) {
        const res = await response.json();
        toastError(res.error ?? 'File size exceeds the limit');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        toastError('An error occurred while uploading the file');
        console.error({ error });
        return;
      }

      const json = await response.json();
      const { fileId, signedUrl } = uploadResponseSchema.parse(json);

      setFiles((prev) => {
        const next = new Map(prev);
        next.set(fileId, {
          status: 'success',
          file: { type: endpoint, signedUrl },
          id: fileId,
        });

        return next;
      });
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <TooltipButton
        tooltip={`Upload files (${toolTipMessage} only)`}
        tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
        size="sm"
        type="button"
        className="py-1 transition-colors duration-200 ease-in-out"
        variant="neutral"
        onClick={openFileDialog}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </TooltipButton>
      <input
        type="file"
        ref={fileInputRef}
        accept={`image/*, ${canUploadFiles && 'application/pdf'}`}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
