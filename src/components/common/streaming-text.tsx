'use client';

import React from 'react';

type StreamingTextProps = React.ComponentProps<'span'> & {
  children: string;
};

export default function StreamingText({ children, ...props }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index < children.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + children[index]);
        setIndex(index + 1);
      }, 100); // Adjust speed here

      return () => clearTimeout(timeout);
    }
  }, [index, children]);

  return <span {...props}>{displayedText}</span>;
}
