import { type IconColor } from '@/utils/icons';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cw(...classNames: ClassValue[]) {
  return twMerge(clsx(classNames));
}

export const inputFieldErrorClassName = cw(
  'border-destructive text-destructive placeholder:text-destructive/70 bg-destructive/10 focus-visible:ring-0',
);

export const inputFieldErrorMessageClassName = cw('text-destructive text-xs');

export const inputFieldClassName = cw(
  'dark:border-muted/50 dark:hover:border-muted dark:focus:border-transparent dark:focus-visible:ring-muted',
);

export const uiCardClassName = cw('bg-muted/30 border-muted/50 pt-4 px-2');

export function iconColorToTailwind(color: IconColor) {
  const colorVariants = {
    grey: 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800',
    red: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
    orange: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
    yellow: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
    green: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    pink: 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/20',
    purple: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
  };

  return colorVariants[color] ?? colorVariants.grey;
}
