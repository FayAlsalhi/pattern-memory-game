'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { useFinePointer } from '@/lib/useReducedMotion';
import { clients, stats } from '@/content/site';
import { CountUp, Reveal } from '../ui/primitives';
import { SignalMark } from '../ui/SignalMark';

/** "What we did in the trial period" — the original Sayt numbers cards. */
export function Numbers() {
  const { c, t } = useLocale();
  return (
    <section aria-labelledby="numbers-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal className="text-center">
          <span className="inline-block rounded-full border border-brand/60 px-5 py-1.5 text-sm text-sky">{c.numbers.kicker}</span>
          <h2 id="numbers-title" className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4rem)] leading-[1.25]">
            <span className="block">{c.numbers.titleA}</span>
            <span className="block text-sky">{c.numbers.titleB}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {stats.map((s, i) => {
            const primary = i === 0;
            return (
              <Reveal key={s.value} delay={i * 0.1}>
                <div className={`relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[36px] p-7 md:min-h-[340px] md:p-9 ${primary ? 'bg-brand' : 'border border-ink-600 bg-ink-800'}`}>
                  <span className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums ${primary ? 'bg-white/15 text-white' : 'bg-ink-600/70 text-sky'}`} dir="ltr">0{i + 1}</span>
                  <SignalMark className={`absolute left-7 top-[42%] -z-10 h-[38%] md:left-8 ${primary ? 'text-white/25' : 'text-ink-600'}`} />
                  <div>
                    <p className={`font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-none ${primary ? 'text-white' : 'text-sky'}`}>
                      <span dir="ltr" className="inline-block">
                        <span className={`me-1 align-[.35em] font-sans text-[.4em] font-normal ${primary ? 'text-white/60' : 'text-brand'}`}>+</span>
                        <CountUp to={s.value} />
                      </span>
                    </p>
                    <p className="mt-3 text-2xl">{t(s.label)}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Clients as an editorial index of names. On desktop the logo follows the
 * pointer over the hovered name; on touch every name carries its logo inline.
 */
export function Clients() {
  const { c, t } = useLocale();
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  /** Float the logo just above the hovered or focused name. */
  const show = (i: number, el: HTMLElement) => {
    const r = box.current?.getBoundingClientRect();
    const e = el.getBoundingClientRect();
    if (r) setPos({ x: e.left - r.left + e.width / 2, y: e.top - r.top });
    setActive(i);
  };

  return (
    <section id="clients" aria-labelledby="clients-title" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker mb-4">{c.clients.kicker}</p>
            <h2 id="clients-title" className="font-display text-[clamp(2rem,4.4vw,3.6rem)]">{c.clients.title}</h2>
          </div>
          {fine && <p className="text-sm text-white/40">{c.clients.hint}</p>}
        </Reveal>

        <div ref={box} onPointerLeave={() => setActive(null)} className="relative mt-12 border-t border-white/10 pt-10">
          <ul className="flex flex-wrap items-center gap-x-[clamp(1rem,2.4vw,2.5rem)] gap-y-4 md:gap-y-6">
            {clients.map((cl, i) => (
              <li key={cl.logo} className="flex items-center gap-[clamp(1rem,2.4vw,2.5rem)]">
                <span
                  tabIndex={fine ? 0 : undefined}
                  onPointerEnter={(e) => show(i, e.currentTarget)}
                  onFocus={(e) => show(i, e.currentTarget)}
                  onBlur={() => setActive(null)}
                  className={`flex items-center gap-3 font-display text-[clamp(1.7rem,4.6vw,4.4rem)] leading-tight transition-colors duration-300 outline-none focus-visible:underline ${active === null || active === i ? 'text-white' : 'text-white/25'}`}
                >
                  {!fine && <img src={asset(cl.logo)} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-xl object-cover" />}
                  {t(cl.name)}
                </span>
                {i < clients.length - 1 && <span aria-hidden className="text-[clamp(1rem,2vw,2rem)] text-sky/60">✦</span>}
              </li>
            ))}
          </ul>

          {fine && (
            <div aria-hidden className="pointer-events-none absolute z-10 transition-[left,top] duration-300 ease-[var(--ease-cine)]" style={{ left: pos.x, top: pos.y }}>
              <AnimatePresence>
                {active !== null && (
                  <motion.img
                    key={active}
                    src={asset(clients[active].logo)}
                    alt=""
                    initial={{ opacity: 0, scale: 0.8, rotate: -8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="absolute -left-[4.5rem] -top-40 h-36 w-36 max-w-none rounded-[28px] object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,.8)] ring-1 ring-white/20"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
