import localFont from 'next/font/local';

/** Thmanyah — the typeface family already used by the original Sayt.Ai site. */
export const sans = localFont({
  src: [
    { path: '../fonts/thmanyah-sans-400.woff2', weight: '400' },
    { path: '../fonts/thmanyah-sans-500.woff2', weight: '600' },
  ],
  variable: '--font-thmanyah-sans',
  display: 'swap',
});

export const display = localFont({
  src: '../fonts/thmanyah-display-700.woff2',
  weight: '700',
  variable: '--font-thmanyah-display',
  display: 'swap',
});

export const text = localFont({
  src: '../fonts/thmanyah-text-300.woff2',
  weight: '300',
  variable: '--font-thmanyah-text',
  display: 'swap',
  preload: false,
});

export const fontVars = `${sans.variable} ${display.variable} ${text.variable}`;
