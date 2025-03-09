'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type NextError from 'next/error';
import React from 'react';

export default function GlobalError({ error, reset }: { error: NextError; reset: () => void }) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
          <div className="max-w-md space-y-6">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
            <Alert variant="destructive" className="border-2">
              <AlertTitle className="text-lg">We're sorry</AlertTitle>
              <AlertDescription>
                An unexpected error occurred. Our team has been notified and is working to fix the
                issue.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground">
              You can try refreshing the page or going back to the previous page.
            </p>
            <Button onClick={() => reset()} className="px-8 py-6 text-base" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
