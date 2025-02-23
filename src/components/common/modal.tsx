'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

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
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md rounded-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6">
          <Dialog.Title className="text-2xl font-medium">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 mb-4 text-base text-gray-500">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button className="absolute top-2 right-2 font-semibold">X</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
