import { File } from 'lucide-react';

import SpinnerLoading from '../icons/animated/spinner';
import { Badge } from '../ui/badge';

type SourceTagProps = {
  fileName: string;
  isUploading: boolean;
};

export default function FileDisplay({ fileName, isUploading }: SourceTagProps) {
  return (
    <Badge
      variant="secondary"
      className="w-auto max-w-[150px] bg-secondary hover:bg-secondary transition-colors duration-200 px-3 py-1.5"
    >
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
