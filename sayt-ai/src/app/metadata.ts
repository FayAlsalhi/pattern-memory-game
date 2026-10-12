import type { Metadata, Viewport } from 'next';
import { copy } from '@/content/copy';
import type { Locale } from '@/content/types';
import { asset } from '@/lib/asset';

export const viewport: Viewport = { themeColor: '#04061a', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

export function metadataFor(locale: Locale): Metadata {
  const m = copy[locale].meta;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://saytai.github.io'),
    title: m.title,
    description: m.description,
    icons: { icon: asset('brand/favicon.svg') },
    alternates: { languages: { ar: asset(''), en: asset('en/') } },
    openGraph: {
      type: 'website',
      title: m.title,
      description: m.description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [asset('media/posters/film-brand.jpg')],
    },
  };
}
