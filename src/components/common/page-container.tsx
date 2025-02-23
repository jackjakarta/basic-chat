import { cw } from '@/utils/tailwind';

export default function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cw('max-w-3xl px-4', className)}>{children}</div>;
}
