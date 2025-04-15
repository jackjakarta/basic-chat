'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import React from 'react';

type AgentKnowledgeDisplayProps = {
  vectorStoreId: string;
};

export default function AgentKnowledgeDisplay({ vectorStoreId }: AgentKnowledgeDisplayProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toastSuccess, toastLoading, toastError } = useToast();

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      await handleUpload();
    }
  }

  async function handleUpload() {
    if (!selectedFile) return;

    toastLoading('Uploading file...');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('vectorStoreId', vectorStoreId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.debug({ uploadedFile: `fileId: ${data.fileId}` });
      } else {
        console.error({ error: `Upload failed with status, ${res.status}` });
      }
      toastSuccess('File uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toastError('Failed to upload file');
    }
  }

  return (
    <Button
      type="button"
      onClick={openFileDialog}
      title="Upload File"
      className="p-1.5 flex items-center justify-center group disabled:cursor-not-allowed rounded-lg hover:bg-secondary/20 me-2"
      aria-label="Upload File"
    >
      <Paperclip className="w-6 h-6 text-dark-gray" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Button>
  );
}
