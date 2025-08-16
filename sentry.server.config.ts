// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { isDevMode } from '@/utils/dev-mode';
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://b1acc7c9cad6c2ec063c3d8e95d07a62@o4508270474231808.ingest.de.sentry.io/4509855015960656',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: isDevMode ? 1 : 0.4,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  environment: isDevMode ? 'development' : 'production',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
