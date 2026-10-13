'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { langHref } from '@/lib/asset';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byId } from '@/content/media';
import { links, trust, typewriter } from '@/content/site';
import { Media } from '../media/Media';
import { Reveal } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { AnimatedLogo } from '../ui/AnimatedLogo';

/**
 * The last chapter: the original "looking for an influencer…" question, the
 * two entry cards, then the sign-off — the
 * official logo. صيت means reputation that travels; the ending is built on that.
 */
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

  const ways = [
    { ...c.contact.brands, href: links.startCampaign },
    { ...c.contact.creators, href: links.joinAsInfluencer },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden pt-28 md:pt-40">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[110vh] opacity-35">
        <Media item={byId('ambient-signal')} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/50 to-ink-950" />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="kicker mb-6">{c.contact.kicker}</p>
          <h2 id="contact-title" className="font-display text-[clamp(2.6rem,8vw,7.5rem)] leading-[1.08]">
            {c.contact.titleA}
            <span className="relative block h-[1.3em] overflow-hidden">
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
          {ways.map((card, k) => (
            <Reveal key={card.tag} delay={k * 0.1}>
              <a
                href={card.href}
                target="_blank"
                rel="noopener"
                className={`group flex min-h-[220px] flex-col justify-between rounded-[32px] p-8 transition-[transform,background] duration-500 ease-[var(--ease-cine)] hover:-translate-y-1 md:p-10 ${
                  k === 0 ? 'bg-white text-ink-900' : 'border border-white/15 bg-white/[.04] backdrop-blur-xl hover:bg-white/[.08]'
                }`}
              >
                <span className={`text-sm ${k === 0 ? 'text-ink-900/60' : 'text-white/55'}`}>{card.tag}</span>
                <span className="flex items-end justify-between gap-6">
                  <span>
                    <span className="block font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight">{card.title}</span>
                    <span className={`mt-2 block max-w-sm leading-7 ${k === 0 ? 'text-ink-900/70' : 'text-white/65'}`}>{card.body}</span>
                  </span>
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:scale-110 ${k === 0 ? 'bg-ink-900 text-white' : 'bg-white text-ink-900'}`}>
                    <Icon name="arrow" className="rtl:rotate-180" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/55">
          {trust.map((x) => (
            <li key={x.value} className="flex items-center gap-2"><span className="font-semibold text-sky" dir="ltr">{x.value}</span>{t(x.label)}</li>
          ))}
        </ul>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { c } = useLocale();
  const nav = [['#work', c.nav.work], ['#creators', c.nav.creators], ['#services', c.nav.services], ['#method', c.nav.method], ['#clients', c.nav.clients]] as const;

  return (
    <footer className="relative mt-32 md:mt-44">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-16 md:grid-cols-12 md:px-8 md:pb-24">
        <div className="md:col-span-6">
          <p className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.2] [text-wrap:balance]">{c.footer.statement}</p>
          <p className="mt-4 max-w-md leading-8 text-white/55">{c.footer.sub}</p>
          <AnimatedLogo label={`${c.brand} AI`} className="mt-10 h-auto w-[min(70vw,300px)]" />
        </div>
        <nav aria-label={c.footer.explore} className="md:col-span-3">
          <p className="mb-4 text-xs tracking-wider text-white/35">{c.footer.explore}</p>
          <ul className="grid gap-2.5">
            {nav.map(([h, l]) => <li key={h}><a href={h} className="text-white/70 transition-colors hover:text-white">{l}</a></li>)}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="mb-4 text-xs tracking-wider text-white/35">{c.footer.talk}</p>
          <ul className="grid gap-2.5">
            <li><a href={links.startCampaign} target="_blank" rel="noopener" className="text-sky hover:text-white">{c.cta.start}</a></li>
            <li><a href={links.joinAsInfluencer} target="_blank" rel="noopener" className="text-white/70 hover:text-white">{c.cta.join}</a></li>
            <li><a href={langHref(c.langSwitch.href)} className="text-white/70 hover:text-white">{c.langSwitch.aria}</a></li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-white/40 md:px-8">
          <p dir="ltr">© {new Date().getFullYear()} Sayt AI · {c.footer.rights}</p>
          <p className="tracking-[.3em]" dir="ltr">{c.footer.line}</p>
          <a href="#top" className="inline-flex items-center gap-2 text-white/60 hover:text-white">
            {c.footer.top}
            <Icon name="arrow" className="-rotate-90 h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
