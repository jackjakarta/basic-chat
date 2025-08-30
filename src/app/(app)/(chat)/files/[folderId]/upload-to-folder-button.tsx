'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import React from 'react';

type UploadToFolderButtonProps = {
  folderId: string;
};

export default function UploadToFolderButton({ folderId }: UploadToFolderButtonProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const { toastSuccess, toastError, toastLoading } = useToast();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file !== undefined) {
      await handleFileUpload(file);
      e.target.value = '';
    }
  }

  async function handleFileUpload(file: File) {
    setIsUploading(true);
    toastLoading('Uploading file...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);

    try {
      const response = await fetch('/api/folder-upload', {
        method: 'POST',
        body: formData,
      });

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

      toastSuccess('File uploaded successfully');
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <>
      <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        <UploadCloud />
        Upload to Folder
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}
