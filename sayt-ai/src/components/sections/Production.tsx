'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byPlacement } from '@/content/media';
import type { MediaItem } from '@/content/types';
import { MediaCard, SectionHeading } from '../ui/primitives';

/**
 * Scene 05 — films, reels and stills on one continuous strip. On desktop the
 * section pins and vertical scroll pans the strip; on touch / reduced motion
 * it is a native swipeable rail.
 */
export function Production() {
  const { c, rtl } = useLocale();
  const list = byPlacement('production');
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const pinned = wide && !reduced;

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, (rtl ? 1 : -1) * distance]);

  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pinned]);

  const strip = (
    <div ref={track} className={`flex items-center gap-5 ${pinned ? 'w-max ps-8' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto px-5 pb-6 md:px-8'}`}>
      {list.map((m) => <Tile key={m.id} item={m} list={list} />)}
    </div>
  );

  return (
    <section
      ref={section}
      aria-labelledby="production-title"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-24 md:py-36'}>
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
          <SectionHeading id="production-title" kicker={c.production.kicker} title={c.production.title}>
            <ul className="flex flex-wrap gap-2">
              {c.production.items.map((s) => (
                <li key={s} className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/70">{s}</li>
              ))}
            </ul>
          </SectionHeading>
        </div>
        <div className="mt-10 md:mt-12">
          {pinned ? <motion.div style={{ x }}>{strip}</motion.div> : strip}
        </div>
      </div>
    </section>
  );
}

function Tile({ item, list }: { item: MediaItem; list: MediaItem[] }) {
  const w = item.aspect === '9:16' ? 'w-[46vw] lg:w-[min(15vw,250px)]' : item.aspect === '16:9' ? 'w-[84vw] lg:w-[min(48vw,760px)]' : item.aspect === '1:1' ? 'w-[64vw] lg:w-[min(26vw,400px)]' : item.aspect === '5:4' ? 'w-[70vw] lg:w-[min(32vw,480px)]' : 'w-[60vw] lg:w-[min(24vw,380px)]';
  return (
    <div className={`${w} shrink-0 snap-center`}>
      <MediaCard item={item} list={list} />
    </div>
  );
}
