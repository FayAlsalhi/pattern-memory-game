const paths = {
  play: <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" stroke="none" />,
  pause: <><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" stroke="none" /></>,
  sound: <><path d="M4 9.5h3l4.5-4v13L7 14.5H4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" /></>,
  muted: <><path d="M4 9.5h3l4.5-4v13L7 14.5H4z" /><path d="m16 9.5 5 5m0-5-5 5" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  expand: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  /** points right — flip with rtl:/ltr: utilities */
  chevron: <path d="m9 5 7 7-7 7" />,
  /** points right — "forward" arrow; flip in RTL */
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  menu: <path d="M4 8h16M4 16h16" />,
};

export function Icon({ name, className = '' }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {paths[name]}
    </svg>
  );
}
