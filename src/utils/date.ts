import { differenceInDays, differenceInMonths } from 'date-fns';

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

export function getTimeSince(pastDate: Date): string {
  const now = new Date();
  const monthsSince = differenceInMonths(now, pastDate);

  if (monthsSince === 0) {
    const daysSince = differenceInDays(now, pastDate);
    return `${daysSince} day${daysSince !== 1 ? 's' : ''}`;
  }

  return `${monthsSince} month${monthsSince !== 1 ? 's' : ''}`;
}
