import React from 'react';

export function useSpinDelay(active: boolean, opts = { delay: 150, minDuration: 250 }) {
  const { delay, minDuration } = opts;
  const [visible, setVisible] = React.useState(false);
  const startRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let t1: number | undefined;
    let t2: number | undefined;

    if (active) {
      startRef.current = Date.now();
      t1 = window.setTimeout(() => setVisible(true), delay);
    } else {
      const started = startRef.current;
      if (started && visible) {
        const elapsed = Date.now() - started;
        const remaining = Math.max(0, delay + minDuration - elapsed);
        t2 = window.setTimeout(() => setVisible(false), remaining);
      } else {
        setVisible(false);
      }
    }

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // putting visible in the array makes the effect run again when the timeout flips it,
    // which is unnecessary work and can cause weird behaviour
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, delay, minDuration]);

  return visible;
}
