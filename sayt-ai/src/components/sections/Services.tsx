'use client';

import { motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { services } from '@/content/site';
import { Reveal } from '../ui/primitives';
import { BriefStudio } from './BriefStudio';

/**
 * "What sets us apart": the brief studio, then the four original services.
 */
export function Services() {
  const { c, t } = useLocale();
  return (
    <section id="services" aria-labelledby="services-title" className="relative overflow-x-clip py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <BriefStudio />

        <ol className="mt-24 grid gap-x-16 border-t border-white/10 md:mt-32 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.n} className="border-b border-white/10 py-9">
              <Reveal className="grid grid-cols-[auto_1fr] gap-x-6">
                <span className="pt-2 font-display text-sm text-sky" dir="ltr">{s.n}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug [text-wrap:balance]">{t(s.title)}</h3>
                  <p className="mt-3 max-w-lg leading-8 text-white/65">{t(s.body)}</p>
                  <p className="mt-3 text-sm text-white/40">
                    {c.services.instead}: <StrikeReveal text={t(s.instead)} />
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

/**
 * The old way, crossed out as you reach it: the words fade in, then a line
 * draws through them in reading direction.
 */
function StrikeReveal({ text }: { text: string }) {
  const { rtl } = useLocale();
  const reduced = usePrefersReducedMotion();
  const view = { once: true, margin: '-15% 0px' } as const;
  return (
    <span className="relative inline-block">
      <motion.span
        initial={reduced ? false : { opacity: 0, x: rtl ? 12 : -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={view}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={view}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
        style={{ originX: rtl ? 1 : 0 }}
        className="pointer-events-none absolute inset-x-0 top-[55%] h-[1.5px] rounded-full bg-sky/70 shadow-[0_0_8px_rgba(147,197,253,.6)]"
      />
    </span>
  );
}
