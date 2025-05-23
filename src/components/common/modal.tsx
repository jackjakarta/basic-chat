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
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20 z-10" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md z-20 rounded-lg -translate-x-1/2 -translate-y-1/2 bg-primary-foreground dark:bg-secondary p-6">
          <Dialog.Title className="text-2xl font-medium">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 mb-4 text-base text-primary-foreground">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <Button className="bg-transparent hover:bg-transparent shadow-none absolute top-2 right-2 font-semibold">
              <X className="text-primary dark:text-primary-foreground" />
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
