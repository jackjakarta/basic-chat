import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type FileRow } from '@/db/schema';
import { ArchiveIcon, FileIcon, FileTextIcon, ImageIcon, VideoIcon } from 'lucide-react';

export default function ProjectFilesDisplay({ files }: { files: FileRow[] }) {
  if (files.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium text-muted-foreground">No files uploaded</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload files to see them displayed here
        </p>
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
