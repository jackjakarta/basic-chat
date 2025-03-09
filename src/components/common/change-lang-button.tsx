'use client';

import { type SiteLanguage } from '@/utils/types';
import Cookies from 'js-cookie';

export default function ChangeLangButton() {
  function handleSetLanguage(lang: SiteLanguage) {
    setClientCookie(lang);
    window.location.reload();
  }

  return <button onClick={() => handleSetLanguage('en')}>Set Language</button>;
}

function setClientCookie(lang: SiteLanguage) {
  Cookies.set('lang', lang, {
    expires: 360,
    path: '/',
  });
}
