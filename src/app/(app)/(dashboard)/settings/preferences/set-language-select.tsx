'use client';

import { useToast } from '@/components/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type AppLocale } from '@/types/utils';
import { appLocaleSchema } from '@/utils/schemas';
import React from 'react';

import { setLanguageCookieAction } from './actions';

export default function LanguageSelect({ currentLocale }: { currentLocale: string }) {
  const { toastSuccess, toastError } = useToast();

  async function handleSetLanguage(newLanguage: string) {
    if (newLanguage === currentLocale) return;

    try {
      await setLanguageCookieAction({ newLanguage });
      toastSuccess('Language set successfully');
    } catch (error) {
      console.error({ error });
      toastError('Failed to set language');
    }
  }

  return (
    <Select value={currentLocale} onValueChange={(value) => handleSetLanguage(value)}>
      <SelectTrigger className="w-[180px] hover:bg-muted">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {appLocaleSchema.options.map((language) => (
          <SelectItem key={language} value={language} className="cursor-pointer hover:bg-muted">
            {languageNameMap(language)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function languageNameMap(language: AppLocale | undefined) {
  if (language === undefined) {
    return undefined;
  }

  const mapping: Record<AppLocale, string> = {
    en: 'English',
    de: 'Deutsch',
    ro: 'Română',
    es: 'Español',
  };

  return mapping[language] ?? language;
}
