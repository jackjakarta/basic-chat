import { File, X } from 'lucide-react';

import SpinnerLoading from '../icons/animated/spinner';
import { Badge } from '../ui/badge';

type SourceTagProps = {
  fileName: string;
  isUploading: boolean;
  onDelete?: () => void;
};

export default function FileDisplay({ fileName, isUploading, onDelete }: SourceTagProps) {
  return (
    <Badge
      variant="secondary"
      className="relative w-auto max-w-[150px] bg-secondary px-3 py-1.5 transition-colors duration-200 hover:bg-secondary"
    >
      {!isUploading && onDelete !== undefined && (
        <button
          type="button"
          className="absolute -left-1.5 -top-1.5 rounded-full bg-secondary-foreground/40 p-0.5 transition-colors duration-200 hover:bg-secondary-foreground/60"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete file"
        >
          <X className="h-3 w-3 text-secondary-foreground" />
        </button>
      )}
      <div className="flex min-w-0 items-center text-sm">
        <div className="flex w-full min-w-0 flex-col">
          <span className="truncate text-secondary-foreground dark:text-primary-foreground/80">
            {isUploading ? (
              <SpinnerLoading className="mr-2 inline h-4 w-4" />
            ) : (
              <File className="mb-0.5 mr-2 inline h-4 w-4" />
            )}
            {fileName}
          </span>
        </div>
      </div>
    </Badge>
  );
}
