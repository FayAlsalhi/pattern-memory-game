'use client';

import { useLocale } from '@/lib/locale';
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
