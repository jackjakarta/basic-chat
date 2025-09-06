import { type IconColor } from '@/utils/icons';
import { cw, iconColorToTailwind } from '@/utils/tailwind';
import * as Icons from 'lucide-react';
import { type LucideIcon, type LucideProps } from 'lucide-react';

type IconName = keyof typeof Icons;

export default function DynamicIcon({
  name,
  iconColor,
  className,
  ...props
}: { name: string; iconColor: IconColor } & LucideProps) {
  const Icon = getLucideIcon(name);
  return <Icon className={cw(iconColorToTailwind(iconColor), className)} {...props} />;
}

function getLucideIcon(name: string): LucideIcon {
  return (Icons[name as IconName] as LucideIcon) ?? (Icons.HelpCircle as LucideIcon);
}
