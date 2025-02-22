import { cw } from '@/utils/tailwind';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cw('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };
