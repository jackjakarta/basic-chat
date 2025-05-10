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
      className="relative w-auto max-w-[150px] bg-secondary hover:bg-secondary transition-colors duration-200 px-3 py-1.5"
    >
      {!isUploading && onDelete !== undefined && (
        <button
          className="absolute -top-1.5 -left-1.5 bg-secondary-foreground/40 hover:bg-secondary-foreground/60 rounded-full p-0.5 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete file"
        >
          <X className="h-3 w-3 text-secondary-foreground" />
        </button>
      )}
      <div className="flex items-center text-sm min-w-0">
        <div className="flex flex-col min-w-0 w-full">
          <span className="truncate text-secondary-foreground dark:text-primary-foreground/80">
            {isUploading ? (
              <SpinnerLoading className="h-4 w-4 mr-2 inline" />
            ) : (
              <File className="h-4 w-4 mb-0.5 mr-2 inline" />
            )}
            {fileName}
          </span>
        </div>
      </div>
    </Badge>
  );
}
