import { env } from '@/env';

export const isDevMode = getEnvironment();

function getEnvironment() {
  const devMode = env.devMode;

  if (devMode === 'false') {
    return false;
  }

  return true;
}
