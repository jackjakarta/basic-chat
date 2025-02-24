import { cw } from '@/utils/tailwind';

export default function LoadingText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cw(className, 'animate-pulse')}>
      {text.split('').map((char, index) => (
        <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
      ))}
    </span>
  );
}
