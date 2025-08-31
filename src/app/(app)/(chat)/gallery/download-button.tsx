'use client';

import { TooltipButton } from '@/components/common/tooltip-button';
import { Download } from 'lucide-react';

type DownloadButtonProps = {
  url: string;
  className?: string;
};

export default function DownloadButton({ url, className }: DownloadButtonProps) {
  return (
    <TooltipButton
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => window.open(url, '_blank')}
      tooltip="Download"
      tooltipClassName="bg-accent text-sidebar-foreground"
    >
      <Download className="size-4" />
    </TooltipButton>
  );
}
