import { cw } from '@/utils/tailwind';

export default function LoadingText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <span className={cw(className, 'animate-pulse')}>{children}</span>;
}
