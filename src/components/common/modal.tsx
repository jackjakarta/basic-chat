'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';

type DialogProps = {
  open: boolean;
  onOpenChange(b: boolean): void;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default function DialogWindow({
  open,
  onOpenChange,
  children,
  title,
  description,
}: DialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-10 bg-black bg-opacity-20" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-20 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary-foreground p-6 dark:bg-secondary">
          <Dialog.Title className="text-2xl font-medium">{title}</Dialog.Title>
          <Dialog.Description className="mb-4 mt-2 text-base text-primary-foreground">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <Button className="absolute right-2 top-2 bg-transparent font-semibold shadow-none hover:bg-transparent">
              <X className="text-primary dark:text-primary-foreground" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
