'use client';

import { cw } from '@/utils/tailwind';
import React, { forwardRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, value, ...props }, ref) => {
    return (
      // @ts-expect-error - we need to pass the ref to the TextareaAutosize component
      <TextareaAutosize
        autoFocus
        className={cw(
          'border-1 w-full resize-none py-1.5 focus:outline-none',
          value === undefined || value.toString().length < 1 ? 'h-9' : 'h-fit',
          className,
        )}
        value={value}
        ref={ref}
        {...props}
      />
    );
  },
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

export default AutoResizeTextarea;
