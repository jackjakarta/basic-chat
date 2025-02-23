'use client';

import { Square, Volume2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

import Spinner from '../icons/spinner';

type TTSButtonProps = {
  text: string;
  className?: React.ComponentProps<'button'>['className'];
  speakIcon?: React.ReactNode;
  stopIcon?: React.ReactNode;
  spinnerClassName?: string;
};

export default function TTSButton({
  text,
  className,
  speakIcon,
  stopIcon,
  spinnerClassName,
}: TTSButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  async function handleSpeak() {
    if (audio && isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    if (!text) {
      toast.error('No text to speak');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(url);
      setAudio(newAudio);

      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const definedSpeakIcon = speakIcon ?? <Volume2 className="w-3.5 h-3.5" />;
  const definedStopIcon = stopIcon ?? <Square className="w-3.5 h-3.5" />;

  return (
    <button
      type="button"
      title={isPlaying ? 'Stop audio' : 'Play message out loud'}
      onClick={handleSpeak}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Spinner className={spinnerClassName} />
      ) : isPlaying ? (
        definedStopIcon
      ) : (
        definedSpeakIcon
      )}
    </button>
  );
}
