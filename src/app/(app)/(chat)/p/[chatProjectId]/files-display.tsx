import { useToast } from '@/components/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type FileRow } from '@/db/schema';
import { ArchiveIcon, FileIcon, FileTextIcon, ImageIcon, Paperclip, VideoIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

type ProjectFilesDisplayProps = {
  chatProjectId: string;
  files: FileRow[];
};

export default function ProjectFilesDisplay({ chatProjectId, files }: ProjectFilesDisplayProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
        <FileIcon className="size-12 text-muted-foreground" />
        <span className="text-lg font-medium text-muted-foreground">No files uploaded</span>
        <p className="text-sm text-muted-foreground">Upload files to see them displayed here</p>
        <UploadButton chatProjectId={chatProjectId} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="mb-2 text-xl font-semibold">Files</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
      <div className="self-center">
        <UploadButton chatProjectId={chatProjectId} />
      </div>
    </div>
  );
}

function FileItem({ file }: { file: FileRow }) {
  const Icon = getFileIcon(file.mimeType);

  return (
    <Card className="w-full max-w-[280px] cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {formatFileSize(file.size)}
              </Badge>
              <span className="truncate text-xs text-muted-foreground">
                {file.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadButton({ chatProjectId }: { chatProjectId: string }) {
  const router = useRouter();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const { toastSuccess, toastError } = useToast();

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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatProjectId', chatProjectId);

    try {
      const response = await fetch(`/api/chat-upload/file`, {
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
      router.refresh();
    }
  }

  return (
    <div>
      <Button
        type="button"
        className="transition-colors duration-200 ease-in-out"
        variant="neutral"
        onClick={openFileDialog}
        disabled={isUploading}
      >
        <Paperclip className="size-4" />
        {isUploading ? 'Uploading...' : 'Upload to project'}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={'application/pdf'}
        onChange={handleFileChange}
      />
    </div>
  );
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.startsWith('video/')) return VideoIcon;
  if (mimeType.includes('text') || mimeType.includes('json')) return FileTextIcon;
  if (mimeType.includes('zip') || mimeType.includes('archive')) return ArchiveIcon;
  return FileIcon;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
