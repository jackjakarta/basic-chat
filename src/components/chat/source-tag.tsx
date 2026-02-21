import { extractDomain } from '@/utils/domain';
import Link from 'next/link';

import { Badge } from '../ui/badge';

type SourceTagProps = {
  url: string;
  title: string;
};

export function SourceTag({ url, title }: SourceTagProps) {
  const domain = extractDomain(url);
  const faviconURL = `https://www.google.com/s2/favicons?domain=${domain}`;

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
          <div className="flex items-center gap-2">
            <img src={faviconURL} alt={`${domain} favicon`} className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium text-muted-foreground">{domain}</span>
          </div>
          <span className="truncate text-primary-foreground/80">{title}</span>
        </div>
      </Link>
    </Badge>
  );
}
