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
        'flex flex-col items-center w-[60px] h-[60px] gap-2 bg-gray-600/30 px-1.5 pt-2.5 rounded-lg',
        className,
      )}
    >
      <PdfIcon className="h-5 w-5 text-gray-500" />
      <span className="text-xs text-secondary-foreground truncate w-full text-center">
        {fileName ?? 'PDF File'}
      </span>
    </div>
  );
}
