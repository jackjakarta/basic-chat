import { extractDomain } from '@/utils/domain';
import Link from 'next/link';

import { Badge } from '../ui/badge';

type SourceTagProps = {
  url: string;
  title: string;
};

export function SourceTag({ url, title }: SourceTagProps) {
  return (
    <Badge
      variant="secondary"
      className="w-24 hover:bg-secondary/70 transition-colors duration-200 px-3 py-1.5"
    >
      <Link
        href={url}
        className="flex items-center text-sm min-w-0"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-col min-w-0 w-full">
          <span className="truncate text-muted-foreground font-medium">{extractDomain(url)}</span>
          <span className="truncate text-primary-foreground/80">{title}</span>
        </div>
      </Link>
    </Badge>
  );
}
