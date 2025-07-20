'use client';

import ReloadIcon from '../icons/reload';

type ErrorDisplayProps = {
  onReload: () => void;
  error: Error | undefined;
};

export default function ErrorDisplay({ onReload, error }: ErrorDisplayProps) {
  return (
    <div className="mx-4 mt-8 gap-2 rounded-2xl border border-red-500 bg-red-100 p-4 text-right text-sm text-red-500">
      <div className="flex items-center justify-between px-2">
        {error?.message ?? 'Something went wrong'}
        <button
          type="button"
          onClick={() => onReload()}
          className="rounded-lg p-2 hover:bg-red-200"
        >
          <ReloadIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
