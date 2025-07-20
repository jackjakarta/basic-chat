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
      className="w-24 px-3 py-1.5 transition-colors duration-200 hover:bg-secondary/70"
    >
      <Link
        href={url}
        className="flex min-w-0 items-center text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex w-full min-w-0 flex-col">
          <span className="truncate font-medium text-muted-foreground">{extractDomain(url)}</span>
          <span className="truncate text-primary-foreground/80">{title}</span>
        </div>
      </Link>
    </Badge>
  );
}
