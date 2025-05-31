import { differenceInMonths } from 'date-fns';

export function formatDateToDayMonthYear(date: Date | undefined): string | undefined {
  if (date === undefined) return;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-UK', options).format(date);
}

export function formatDateToDayMonthYearTime(date: Date | undefined): string | undefined {
  if (date === undefined) return;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('en-UK', options).format(date);
}

export function getMonthsSince(pastDate: Date): number {
  const now = new Date();
  const timeSince = differenceInMonths(now, pastDate);

  return timeSince;
}
