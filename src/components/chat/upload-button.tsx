'use client';

import { LocalFileState } from '@/types/files';
import { Paperclip } from 'lucide-react';
import React from 'react';

import { ButtonTooltip } from '../common/tooltip-button';
import { useToast } from '../hooks/use-toast';

type UploadButtonProps = {
  setFiles: React.Dispatch<React.SetStateAction<Map<string, LocalFileState>>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UploadButton({ setFiles, setIsUploading }: UploadButtonProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toastError } = useToast();

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

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/chat-upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 418) {
        toastError('Invalid file type. Only images are supported.');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        console.error({ error });
        toastError('An error occurred while uploading the file');
        return;
      }

      const { fileId, signedURL } = await response.json();

      setFiles((prev) => {
        const next = new Map(prev);
        next.set(fileId, {
          status: 'success',
          file: { type: 'image', imageUrl: signedURL },
          id: fileId,
        });

        return next;
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toastError('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <ButtonTooltip
        tooltip="Upload files (images only)"
        tooltipClassName="bg-black py-2 rounded-lg mb-0.5"
        size="sm"
        type="button"
        className="py-1 transition-colors duration-200 ease-in-out "
        variant="neutral"
        onClick={openFileDialog}
      >
        <Paperclip className="h-4 w-4" />
      </ButtonTooltip>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
