'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';

type CreateAsistantButtonProps = {
  className?: React.ComponentProps<'button'>['className'];
};

export default function CreateAgentButton({ className }: CreateAsistantButtonProps) {
  const t = useTranslations('agents');
  const router = useRouter();

  function handleClick() {
    router.push('/agents/create');
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button onClick={handleClick} className={className}>
        <span className="text-sm">{t('buttons.create-agent')}</span>
      </Button>
    </div>
  );
}
