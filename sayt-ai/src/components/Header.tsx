'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { langHref } from '@/lib/asset';
import { links } from '@/content/site';
import { Icon } from './ui/Icon';
import { AnimatedLogo } from './ui/AnimatedLogo';

/** The official Sayt Ai logo, with the same glowing signal as the footer. */
export function Logo({ className = '' }: { className?: string }) {
  const { c } = useLocale();
  return <AnimatedLogo label={`${c.brand} AI`} className={`h-10 w-[98px] ${className}`} />;
}

export function Header() {
  const { c } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const nav = [
    ['#work', c.nav.work],
    ['#creators', c.nav.creators],
    ['#services', c.nav.services],
    ['#method', c.nav.method],
    ['#clients', c.nav.clients],
  ] as const;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${scrolled || open ? 'border-b border-white/[.07] bg-ink-950/60 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-6 px-5 md:px-8">
        <a href="#top" className="shrink-0" aria-label={`${c.brand} AI`}><Logo /></a>
        <nav aria-label="primary" className="ms-6 hidden items-center gap-1 lg:flex">
          {nav.map(([h, l]) => (
            <a key={h} href={h} className="rounded-full px-3.5 py-2 text-[15px] text-white/70 transition hover:bg-white/[.06] hover:text-white">{l}</a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <a href={langHref(c.langSwitch.href)} aria-label={c.langSwitch.aria} className="ctl text-[13px] font-semibold" hrefLang={c.langSwitch.href === '/' ? 'ar' : 'en'}>
            {c.langSwitch.label}
          </a>
          <a href={links.startCampaign} target="_blank" rel="noopener" className="btn-primary hidden min-h-[44px] px-5 text-[15px] sm:inline-flex">{c.cta.start}</a>
          <button className="ctl lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="menu">
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {nav.map(([h, l]) => (
                <a key={h} href={h} onClick={() => setOpen(false)} className="border-b border-white/[.06] py-3.5 font-display text-2xl">{l}</a>
              ))}
              <a href={links.startCampaign} target="_blank" rel="noopener" className="btn-primary mt-4">{c.cta.start}</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
