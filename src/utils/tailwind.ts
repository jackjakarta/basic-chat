import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cw(...classNames: ClassValue[]) {
  return twMerge(clsx(classNames));
}

export const inputFieldErrorClassName =
  'border-destructive text-destructive placeholder:text-destructive/70 bg-destructive/10 focus-visible:ring-0';

export const inputFieldErrorMessageClassName = 'text-destructive text-xs';

export const inputFieldClassName =
  'dark:border-muted/50 dark:hover:border-muted dark:focus:border-transparent dark:focus-visible:ring-muted';
