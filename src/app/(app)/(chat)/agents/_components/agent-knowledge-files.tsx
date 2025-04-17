'use client';

import FileDisplay from '@/components/common/file-display';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { type VectorFile } from '@/db/schema';
import { Plus } from 'lucide-react';
import React from 'react';

type AgentKnowledgeDisplayProps = {
  vectorStoreId: string | null;
  files: VectorFile[];
};

export default function AgentKnowledgeDisplay({
  vectorStoreId,
  files,
}: AgentKnowledgeDisplayProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toastSuccess, toastError } = useToast();

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    await handleUpload(file);
    e.target.value = '';
  }

  async function handleUpload(file: File) {
    if (file === null) return;

    if (vectorStoreId === null) {
      toastError('Failed to upload file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
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
      setSelectedFile(null);
      toastError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold text-lg">Knowledge Base:</span>

      <Button
        type="button"
        variant="secondary"
        onClick={openFileDialog}
        title="Upload File"
        className="py-1 w-fit flex items-center justify-center group disabled:cursor-not-allowed rounded-lg hover:bg-secondary/20 me-2"
        aria-label="Upload File"
      >
        <Plus />
        Add files
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        {files.length === 0 ? (
          <span className="text-sm text-muted-foreground">No files uploaded yet.</span>
        ) : (
          <>
            {files.map((file) => (
              <FileDisplay key={file.fileId} fileName={file.fileName} isUploading={false} />
            ))}
            {selectedFile && <FileDisplay fileName={selectedFile.name} isUploading={isUploading} />}
          </>
        )}
      </div>
    </div>
  );
}
