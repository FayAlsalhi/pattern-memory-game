'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byId } from '@/content/media';
import { links, trust, typewriter } from '@/content/site';
import { Media } from '../media/Media';
import { Reveal } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { Logo } from '../Header';

/** Scene 07 — cinematic close with the campaign inquiry. */
export function Contact() {
  const { c, t, rtl } = useLocale();
  const reduced = usePrefersReducedMotion();
  const words = typewriter.map(t);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [reduced, words.length]);

  const cards = [
    { ...c.contact.brands, href: links.startCampaign, primary: true },
    { ...c.contact.creators, href: links.joinAsInfluencer, primary: false },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden pb-10 pt-28 md:pt-40">
      {/* footage behind the final call to action */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-35">
        <Media item={byId('film-brand')} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/40 to-ink-950" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="kicker mb-6">{c.contact.kicker}</p>
          <h2 id="contact-title" className="font-display text-[clamp(2.6rem,8vw,7.5rem)] leading-[1.08]">
            {c.contact.titleA}
            <span className="relative block h-[1.25em] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={i}
                  className="type-grain absolute inset-x-0 top-0 block"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {words[i]}{rtl ? '؟' : '?'}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">{c.contact.lead}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {cards.map((card, k) => (
            <Reveal key={card.tag} delay={k * 0.1}>
              <a
                href={card.href}
                target="_blank"
                rel="noopener"
                className={`group flex min-h-[220px] flex-col justify-between rounded-[32px] p-8 transition-[transform,background] duration-500 ease-[var(--ease-cine)] hover:-translate-y-1 md:p-10 ${
                  card.primary ? 'bg-white text-ink-900' : 'border border-white/15 bg-white/[.04] backdrop-blur-xl hover:bg-white/[.08]'
                }`}
              >
                <span className={`text-sm ${card.primary ? 'text-ink-900/60' : 'text-white/55'}`}>{card.tag}</span>
                <span className="flex items-end justify-between gap-6">
                  <span>
                    <span className="block font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">{card.title}</span>
                    <span className={`mt-2 block max-w-sm leading-7 ${card.primary ? 'text-ink-900/70' : 'text-white/65'}`}>{card.body}</span>
                  </span>
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:scale-110 ${card.primary ? 'bg-ink-900 text-white' : 'bg-white text-ink-900'}`}>
                    <Icon name="arrow" className="rtl:rotate-180" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
          {trust.map((x) => (
            <li key={x.value} className="flex items-center gap-2"><span className="font-semibold text-sky" dir="ltr">{x.value}</span>{t(x.label)}</li>
          ))}
        </ul>

        <Footer />
      </div>
    </section>
  );
}

function Footer() {
  const { c } = useLocale();
  return (
    <footer className="mt-28 flex flex-col gap-8 border-t border-white/[.08] pt-10 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Logo />
        <span className="hidden text-[11px] tracking-[.25em] text-white/40 sm:inline" dir="ltr">{c.footer.line}</span>
      </div>
      <nav aria-label="footer" className="flex flex-wrap gap-2">
        {([['#services', c.nav.services], ['#method', c.nav.method], ['#clients', c.nav.clients]] as const).map(([h, l]) => (
          <a key={h} href={h} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white">{l}</a>
        ))}
        <a href={links.startCampaign} target="_blank" rel="noopener" className="rounded-full border border-sky/50 px-4 py-2 text-sm text-sky">{c.cta.start}</a>
      </nav>
      <p className="text-xs text-white/35" dir="ltr">© {new Date().getFullYear()} Sayt AI · {c.footer.rights}</p>
    </footer>
  );
}
