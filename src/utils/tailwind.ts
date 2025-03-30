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
