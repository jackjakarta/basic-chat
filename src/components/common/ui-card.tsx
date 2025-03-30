import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cw } from '@/utils/tailwind';
import type React from 'react';

type UICardProps = {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function UICard({
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  header,
  footer,
  children,
}: UICardProps) {
  return (
    <Card className={cw('w-full', className)}>
      {header && <CardHeader className={cw('px-6 py-4', headerClassName)}>{header}</CardHeader>}
      <CardContent className={cw('px-6 py-4', contentClassName)}>{children}</CardContent>
      {footer && <CardFooter className={cw('px-6 py-4', footerClassName)}>{footer}</CardFooter>}
    </Card>
  );
}
