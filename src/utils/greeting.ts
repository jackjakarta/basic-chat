/**
 * Time-based greeting generator for German time zones
 * Returns a random but consistent greeting based on the time of day
 */

// Define the types of time periods
type TimePeriod = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'anytime';

// Define the greeting structure
type Greeting = {
  text: string;
  period: TimePeriod;
};

/**
 * Collection of all possible greetings organized by time period
 */
const greetings: Record<TimePeriod, string[]> = {
  anytime: ['Welcome back', 'Nice to see you'],
  morning: ['Good morning', 'A brand new day'],
  noon: ['Enjoy your lunch'],
  afternoon: ['Good afternoon', 'Hope your day is going well'],
  evening: ['Good evening', 'How was your day'],
  night: ['Good night', 'Late night thoughts'],
};

/**
 * Determines the current time period based on the hour in Germany
 * @returns The current time period
 */
function getCurrentTimePeriod(): TimePeriod {
  // Get current hour in Germany
  const now = new Date();
  const germanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  const hour = germanTime.getHours();

  // Determine time period based on hour ranges
  if (hour >= 5 && hour < 11.5) {
    return 'morning';
  } else if (hour >= 11.5 && hour < 13.5) {
    return 'noon';
  } else if (hour >= 13.5 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Generates a seeded random number based on the day
 * @param max The maximum value (exclusive)
 * @param seed The seed to use for randomization
 * @returns A pseudo-random number between 0 and max-1
 */
function seededRandom(max: number, seed: number): number {
  // Simple seeded random function
  const x = Math.sin(seed) * 10000;
  const randomValue = x - Math.floor(x);
  return Math.floor(randomValue * max);
}

/**
 * Gets today's date as a number to use as a seed
 * @returns A number representing today's date in Germany
 */
function getTodaySeed(): number {
  const now = new Date();
  const germanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
  return (
    germanTime.getFullYear() * 10000 + (germanTime.getMonth() + 1) * 100 + germanTime.getDate()
  );
}

/**
 * Returns a greeting appropriate for the current time in Germany
 * @param maybeFirstName Optional first name to personalize the greeting
 * @returns A greeting string that remains consistent throughout the time period
 */
export function getTimeBasedGreeting(maybeFirstName?: string): string {
  const currentPeriod = getCurrentTimePeriod();
  const todaySeed = getTodaySeed();

  const combinedGreetings: Greeting[] = [
    ...greetings[currentPeriod].map((text) => ({ text, period: currentPeriod })),
    ...(currentPeriod !== 'noon'
      ? greetings.anytime.map((text) => ({ text, period: 'anytime' as const }))
      : []),
  ];

  const randomIndex = seededRandom(combinedGreetings.length, todaySeed + currentPeriod.length);
  const selectedGreeting = combinedGreetings[randomIndex];

  if (selectedGreeting === undefined) {
    return 'Nice to see you';
  }

  const nameAddition = maybeFirstName ? `, ${maybeFirstName}` : '';

  const needsExclamation = [
    'Welcome back',
    'Nice to see you',
    'Good morning',
    'A brand new day',
    'Enjoy your lunch',
    'Good evening',
  ].includes(selectedGreeting.text);

  const isQuestion = ['How was your day'].includes(selectedGreeting.text);

  const punctuation = isQuestion ? '?' : needsExclamation ? '!' : '.';

  return `${selectedGreeting.text}${nameAddition}${punctuation}`;
}
