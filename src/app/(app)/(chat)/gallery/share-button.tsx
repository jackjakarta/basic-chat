'use client';

import { TooltipButton } from '@/components/common/tooltip-button';
import { useToast } from '@/components/hooks/use-toast';
import { Share } from 'lucide-react';

type ShareButtonProps = {
  url: string;
  className?: string;
};

export default function ShareButton({ url, className }: ShareButtonProps) {
  const { toastSuccess } = useToast();

  function handleCopy() {
    navigator.clipboard.writeText(url);
    toastSuccess('Image URL copied to clipboard');
  }

  return (
    <TooltipButton
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleCopy}
      tooltip="Share"
      tooltipClassName="bg-accent text-sidebar-foreground"
    >
      <Share className="size-4" />
    </TooltipButton>
  );
}
