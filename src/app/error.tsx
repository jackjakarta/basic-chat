'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import React from 'react';

export default function Error({ error, reset }: { error: NextError; reset: () => void }) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
