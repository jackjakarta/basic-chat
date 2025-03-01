'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

type ButtonWithTooltipProps = React.ComponentProps<typeof Button> & {
  children: React.ReactNode;
  tooltip: string;
  tooltipClassName?: string;
};

export function ButtonTooltip({
  children,
  tooltip,
  tooltipClassName,
  ...props
}: ButtonWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...props}>{children}</Button>
        </TooltipTrigger>
        <TooltipContent className={tooltipClassName}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
