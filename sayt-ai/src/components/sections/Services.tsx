'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { services } from '@/content/site';
import { Reveal, SectionHeading } from '../ui/primitives';

/** Poster frames used as storyboard thumbnails in each sample brief. */
const boards = [
  ['ugc-skincare', 'influencer-lifestyle', 'product-fragrance'],
  ['influencer-day', 'celebrity-launch', 'influencer-unboxing'],
  ['brand-opening', 'social-food', 'ugc-coffee'],
];

/**
 * "What sets us apart": a working brief document you can flip between three
 * creators — the service shown as the artefact itself — then the full list.
 */
export function Services() {
  const { c, t } = useLocale();
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading id="services-title" kicker={c.services.kicker} title={c.services.title} />

        <BriefDesk />

        <ol className="mt-24 grid gap-x-16 border-t border-white/10 md:mt-32 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.n} className="border-b border-white/10 py-9">
              <Reveal className="grid grid-cols-[auto_1fr] gap-x-6">
                <span className="pt-2 font-display text-sm text-sky" dir="ltr">{s.n}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug [text-wrap:balance]">{t(s.title)}</h3>
                  <p className="mt-3 max-w-lg leading-8 text-white/65">{t(s.body)}</p>
                  <p className="mt-3 text-sm text-white/40">
                    {c.services.instead}: <span className="line-through decoration-sky/60">{t(s.instead)}</span>
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BriefDesk() {
  const { c, rtl } = useLocale();
  const b = c.brief;
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const tab = b.tabs[i];

  const onKey = (e: React.KeyboardEvent) => {
    const fwd = e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const back = e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    if (!fwd && !back) return;
    e.preventDefault();
    const n = (i + (fwd ? 1 : -1) + b.tabs.length) % b.tabs.length;
    setI(n);
    tabs.current[n]?.focus();
  };

  return (
    <div className="mt-16 grid items-start gap-12 md:mt-24 lg:grid-cols-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <h3 className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.2] [text-wrap:balance]">{b.title}</h3>
        <p className="mt-5 max-w-md leading-8 text-white/65">{b.lead}</p>

        <div role="tablist" aria-label={b.kicker} aria-orientation="vertical" onKeyDown={onKey} className="mt-10 flex flex-col">
          {b.tabs.map((x, k) => {
            const on = k === i;
            return (
              <button
                key={x.who}
                ref={(el) => { tabs.current[k] = el; }}
                role="tab"
                id={`brief-tab-${k}`}
                aria-selected={on}
                aria-controls="brief-doc"
                tabIndex={on ? 0 : -1}
                onClick={() => setI(k)}
                className={`group flex items-baseline gap-5 border-t border-white/10 py-5 text-start transition-colors last:border-b ${on ? 'text-white' : 'text-white/40 hover:text-white/75'}`}
              >
                <span className="font-display text-sm tabular-nums text-sky/80" dir="ltr">{String.fromCharCode(65 + k)}</span>
                <span className="font-display text-[clamp(1.3rem,2.2vw,1.8rem)]">{x.who}</span>
                <span aria-hidden className={`ms-auto h-px self-center bg-sky transition-all duration-500 ${on ? 'w-12' : 'w-0'}`} />
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* the document: a sheet of paper on the desk, two more briefs underneath */}
      <div className="relative lg:col-span-7">
        <div aria-hidden className="absolute inset-x-6 -bottom-4 top-6 rotate-[2.5deg] rounded-[6px] bg-sand/25" />
        <div aria-hidden className="absolute inset-x-3 -bottom-2 top-3 -rotate-[1.5deg] rounded-[6px] bg-sand/45" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={i}
            id="brief-doc"
            role="tabpanel"
            aria-labelledby={`brief-tab-${i}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, rotate: rtl ? 2 : -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16, rotate: rtl ? -1.5 : 1.5 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[6px] bg-sand p-6 text-ink-900 shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)] sm:p-9"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink-900 pb-4">
              <div>
                <p className="text-xs tracking-wider text-ink-900/55">{b.doc}</p>
                <p className="font-display text-2xl sm:text-3xl">{tab.who}</p>
              </div>
              <span className="rounded-full border border-ink-900/30 px-3 py-1 text-xs text-ink-900/60">{b.sample}</span>
            </header>

            <dl className="grid gap-x-8 gap-y-5 py-6 sm:grid-cols-[8rem_1fr]">
              {(['audience', 'voice', 'idea'] as const).map((f) => (
                <div key={f} className="contents">
                  <dt className="text-sm text-ink-900/55">{b.fields[f]}</dt>
                  <dd className={`min-w-0 leading-7 ${f === 'idea' ? 'font-display text-xl leading-8' : ''}`}>{tab[f]}</dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-ink-900/15 pt-5">
              <p className="mb-3 text-sm text-ink-900/55">{b.fields.scenes}</p>
              <ol className="grid grid-cols-3 gap-3">
                {tab.scenes.map((s, k) => (
                  <li key={s} className="min-w-0">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-ink-900">
                      <img src={asset(`media/posters/${boards[i][k]}.jpg`)} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 grayscale-[35%]" />
                      <span className="absolute start-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-sand font-display text-xs" dir="ltr">{k + 1}</span>
                    </div>
                    <p className="mt-2 font-serif text-sm leading-5 text-ink-900/80">{s}</p>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 border-t border-ink-900/15 pt-4 text-sm">
              <span className="text-ink-900/55">{b.fields.measure}</span>
              <span className="font-semibold">{tab.measure}</span>
            </p>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
