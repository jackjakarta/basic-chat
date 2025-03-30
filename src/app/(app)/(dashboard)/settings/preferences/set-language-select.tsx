'use client';

import { useToast } from '@/components/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

import { setLanguageCookie } from './actions';

export default function SetLanguageSelect() {
  const { toastSuccess, toastError, toastLoading } = useToast();
  const [language, setLanguage] = React.useState('en');

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      setLanguage(document.documentElement.lang);
    }
  }, []);

  async function handleSetLanguage(newLanguage: string) {
    if (newLanguage === language) return;
    toastLoading('Setting language...');

    try {
      await setLanguageCookie({ newLanguage });
      toastSuccess('Language set successfully');
      window.location.reload();
    } catch (error) {
      console.error({ error });
      toastError('Failed to set language');
    }
  }

  return (
    <Select value={language} onValueChange={(val) => handleSetLanguage(val)}>
      <SelectTrigger className="w-[180px] hover:bg-muted">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value="en">
          English
        </SelectItem>
        <SelectItem className="cursor-pointer" value="de">
          Deutsch
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
