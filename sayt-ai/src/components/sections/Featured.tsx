'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byId, byPlacement } from '@/content/media';
import { keywords } from '@/content/site';
import { Media, PlaceholderBadge } from '../media/Media';
import { useViewer } from '../media/Viewer';
import { MediaCard, Reveal, SectionHeading } from '../ui/primitives';
import { Icon } from '../ui/Icon';

/** Scene 02 — a cinema-scale film that opens up as it enters, then an editorial spread. */
export function Featured() {
  const { c, t } = useLocale();
  const list = byPlacement('featured');
  const hero = byId('film-brand');
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { open } = useViewer();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 28]);

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-36">
      <Ticker words={keywords.map(t)} />
      <div className="mx-auto mt-20 max-w-[1400px] px-5 md:mt-28 md:px-8">
        <SectionHeading id="work-title" kicker={c.featured.kicker} title={c.featured.title} />

        <motion.div ref={ref} style={{ scale, borderRadius: radius }} className="relative mt-12 overflow-hidden shadow-[0_60px_140px_-40px_rgba(0,0,0,.9)] ring-1 ring-white/10">
          <button type="button" onClick={() => open(list, list.findIndex((x) => x.id === hero.id))} aria-label={c.media.open(t(hero.title))} className="group relative block aspect-[4/5] w-full sm:aspect-video">
            <Media item={hero} boost={6} />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
            <PlaceholderBadge item={hero} className="absolute left-5 top-5" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-10">
              <span>
                <span className="block text-sm text-white/60">{t(hero.format)}</span>
                <span className="font-display text-3xl md:text-5xl">{t(hero.title)}</span>
              </span>
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-ink-900 transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
                <Icon name="play" className="h-6 w-6" />
              </span>
            </span>
          </button>
        </motion.div>

        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-12">
          <Reveal className="col-span-1 md:col-span-4 md:row-span-2">
            <MediaCard item={byId('photo-portrait')} list={list} className="h-full max-md:aspect-[4/5]" ratio={false} />
          </Reveal>
          <Reveal delay={0.08} className="col-span-1 md:col-span-8">
            <MediaCard item={byId('film-launch')} list={list} className="max-md:aspect-[4/5]!" />
          </Reveal>
          <Reveal delay={0.12} className="col-span-1 md:col-span-5">
            <MediaCard item={byId('photo-product')} list={list} className="md:aspect-[4/3]!" />
          </Reveal>
          <Reveal delay={0.16} className="col-span-1 md:col-span-3">
            <MediaCard item={byId('film-event')} list={list} className="aspect-[3/4]! md:aspect-auto! md:h-full" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Ticker({ words }: { words: string[] }) {
  const row = [...words, ...words];
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-white/[.08] py-5 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="marquee gap-10 whitespace-nowrap font-display text-2xl text-white/70 md:text-3xl">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">{w}<span className="text-sky">✦</span></span>
        ))}
      </div>
    </div>
  );
}
