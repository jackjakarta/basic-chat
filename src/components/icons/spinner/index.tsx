import './style.css';

import { cw } from '@/utils/tailwind';

export default function Spinner(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        className={cw('spin2', props.className)}
        cx="400"
        cy="400"
        fill="none"
        r="250"
        strokeWidth="70"
        stroke="currentColor"
        strokeDasharray="795 1400"
        strokeLinecap="round"
      />
    </svg>
  );
}
