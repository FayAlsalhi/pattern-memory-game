'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byPlacement, categories } from '@/content/media';
import { stats } from '@/content/site';
import type { MediaItem } from '@/content/types';
import { PhoneFrame } from '../media/PhoneFrame';
import { Media, PlaceholderBadge } from '../media/Media';
import { useViewer } from '../media/Viewer';
import { CountUp, Reveal, SectionHeading } from '../ui/primitives';

/** Scene 03 — influencers & celebrities in portrait, on devices, with minimal labels. */
export function Creators() {
  const { c, t } = useLocale();
  const list = byPlacement('creators').filter((m) => m.aspect === '9:16');
  const portrait = byPlacement('creators').find((m) => m.kind === 'image');
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const [influencers] = stats;

  return (
    <section id="creators" aria-labelledby="creators-title" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading id="creators-title" kicker={c.creators.kicker} title={c.creators.title}>
          <Reveal delay={0.1} className="text-start">
            <p className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-none text-white">
              <span className="text-sky">+</span><CountUp to={influencers.value} />
            </p>
            <p className="mt-2 text-white/60">{t(influencers.label)}</p>
          </Reveal>
        </SectionHeading>

        <div ref={ref} className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 md:mx-0 md:grid md:grid-cols-12 md:items-start md:gap-6 md:overflow-visible md:px-0">
          {portrait && (
            <Reveal className="hidden md:col-span-4 md:block">
              <figure className="relative overflow-hidden rounded-[28px] ring-1 ring-white/10">
                <div className="aspect-[4/5]"><Media item={portrait} /></div>
                <PlaceholderBadge item={portrait} className="absolute left-4 top-4" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-sm text-white/75">{c.creators.note}</figcaption>
              </figure>
            </Reveal>
          )}
          {list.map((item, i) => (
            <CreatorPhone key={item.id} item={item} list={list} i={i} progress={scrollYProgress} reduced={reduced}
              label={t(categories.find((x) => x.id === item.category)!.label)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CreatorPhone({ item, list, i, progress, reduced, label }: {
  item: MediaItem; list: MediaItem[]; i: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; reduced: boolean; label: string;
}) {
  const { c, t } = useLocale();
  const { open } = useViewer();
  const offsets = [40, -30, 70, 0];
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [offsets[i % 4] + 60, offsets[i % 4] - 60]);
  return (
    <motion.div style={{ y }} className="w-[62vw] max-w-[260px] shrink-0 snap-center md:col-span-2 md:w-auto md:max-w-none">
      <Reveal delay={i * 0.08}>
        <button type="button" onClick={() => open(list, i)} aria-label={c.media.open(t(item.title))} className="group block w-full text-start">
          <PhoneFrame className="transition-transform duration-700 ease-[var(--ease-cine)] group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
            <Media item={item} />
            <PlaceholderBadge item={item} className="absolute left-[7%] top-[8.5%] scale-90" />
          </PhoneFrame>
          <span className="mt-4 block px-1">
            <span className="block font-display text-lg leading-snug">{t(item.title)}</span>
            <span className="text-xs text-white/55">{item.creator ?? label}</span>
          </span>
        </button>
      </Reveal>
    </motion.div>
  );
}
