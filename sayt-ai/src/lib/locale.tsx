'use client';

import { createContext, useContext } from 'react';
import { copy, type Copy } from '@/content/copy';
import type { L10n, Locale } from '@/content/types';

const LocaleContext = createContext<Locale>('ar');

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): { locale: Locale; c: Copy; t: (s: L10n) => string; rtl: boolean } {
  const locale = useContext(LocaleContext);
  return { locale, c: copy[locale], t: (s) => (locale === 'en' && s.en) || s.ar, rtl: locale === 'ar' };
}
