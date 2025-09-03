'use client';

import { cw } from '@/utils/tailwind';
import { Command } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type ShortcutsDialogProps = {
  trigger?: React.ReactNode;
  buttonRef?: React.ComponentProps<'button'>['ref'];
  hidden?: boolean;
};

export default function ShortcutsDialog({
  trigger,
  buttonRef,
  hidden = false,
}: ShortcutsDialogProps) {
  const isMacOs = true;
  const platformKey = isMacOs ? 'CMD' : 'CTRL';

  const SHORTCUTS = [
    {
      category: 'Navigation',
      items: [
        { keys: [platformKey, 'K'], description: 'Open command menu' },
        { keys: [platformKey, 'B'], description: 'Toggle sidebar' },
      ],
    },
    {
      category: 'Chats',
      items: [{ keys: [platformKey, 'Shift', 'O'], description: 'New chat' }],
    },
    {
      category: 'Utility',
      items: [{ keys: [platformKey, '/'], description: 'Open shortcuts' }],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            ref={buttonRef}
            type="button"
            variant="outline"
            size="sm"
            className={cw(hidden && 'hidden')}
          >
            <Command className="mr-2 h-4 w-4" />
            Shortcuts
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {SHORTCUTS.map((section) => (
            <div key={section.category} className="space-y-3">
              <h3 className="border-b border-border pb-1 text-sm font-semibold text-foreground">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.items.map((shortcut, index) => (
                  <ShortcutItem
                    key={index}
                    keys={shortcut.keys}
                    description={shortcut.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-border bg-muted px-1.5 text-xs font-medium shadow-sm">
      {children}
    </kbd>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center gap-1">
            <ShortcutKey>{key}</ShortcutKey>
            {index < keys.length - 1 && <span className="text-xs text-muted-foreground">+</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
