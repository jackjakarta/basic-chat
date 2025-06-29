'use client';

import ReloadIcon from '../icons/reload';

type ErrorDisplayProps = {
  onReload: () => void;
  error: Error | undefined;
};

export default function ErrorDisplay({ onReload, error }: ErrorDisplayProps) {
  return (
    <div className="mx-4 p-4 gap-2 text-sm rounded-2xl bg-red-100 text-red-500 border border-red-500 text-right mt-8">
      <div className="flex justify-between items-center px-2">
        {error?.message ?? 'Something went wrong'}
        <button
          type="button"
          onClick={() => onReload()}
          className="hover:bg-red-200 p-2 rounded-lg"
        >
          <ReloadIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
