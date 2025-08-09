import React from 'react';

type UseKeyboardShortcutProps = {
  key: string;
  callback: (e: KeyboardEvent) => void;
  withShift?: boolean;
};

export function useKeyboardShortcut({
  key,
  callback,
  withShift = false,
}: UseKeyboardShortcutProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== key) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      if (withShift ? !e.shiftKey : e.shiftKey) return;

      e.preventDefault();
      callback(e);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, withShift]);
}
