import { cw } from '@/utils/tailwind';

import PdfIcon from '../icons/pdf';

export default function DisplayPdfFile({
  fileName,
  className,
}: {
  fileName: string | undefined;
  className?: string;
}) {
  return (
    <div
      className={cw(
        'flex h-[60px] w-[60px] flex-col items-center gap-2 rounded-lg bg-gray-600/30 px-1.5 pt-2.5',
        className,
      )}
    >
      <PdfIcon className="h-5 w-5 text-gray-500" />
      <span className="w-full truncate text-center text-xs text-secondary-foreground">
        {fileName ?? 'PDF File'}
      </span>
    </div>
  );
}
