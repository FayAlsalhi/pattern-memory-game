'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { categories } from '@/content/media';
import type { MediaItem } from '@/content/types';
import { Media, PlaceholderBadge, ratioClass } from '../media/Media';
import { useViewer } from '../media/Viewer';
import { Icon } from './Icon';

export function Reveal({ children, delay = 0, className = '', y = 28 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ kicker, title, children, className = '', id }: { kicker: string; title: string; children?: React.ReactNode; className?: string; id?: string }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`}>
      <Reveal>
        <p className="kicker mb-4">{kicker}</p>
        <h2 id={id} className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.15]">{title}</h2>
      </Reveal>
      {children}
    </div>
  );
}

/**
 * Clickable media tile: preview plays muted while visible, hover boosts it to
 * the front of the playback queue, click/tap opens the full viewer.
 */
export function MediaCard({ item, list, className = '', showMeta = true, ratio = true, eager }: {
  item: MediaItem; list: MediaItem[]; className?: string; showMeta?: boolean; ratio?: boolean; eager?: boolean;
}) {
  const { c, t } = useLocale();
  const { open } = useViewer();
  const [hover, setHover] = useState(false);
  const cat = categories.find((x) => x.id === item.category)!;
  return (
    <button
      type="button"
      onClick={() => open(list, Math.max(0, list.findIndex((x) => x.id === item.id)))}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={c.media.open(t(item.title))}
      className={`group relative block w-full overflow-hidden rounded-[22px] bg-ink-800 text-start ring-1 ring-white/[.08] transition-[transform,box-shadow] duration-500 ease-[var(--ease-cine)] hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,.9)] ${ratio ? ratioClass[item.aspect] : ''} ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-[1.04]">
        <Media item={item} boost={hover ? 5 : 0} eager={eager} />
      </div>
      {/* physical left: generated placeholder clips carry their own label top-right */}
      <PlaceholderBadge item={item} className="absolute left-3 top-3" />
      {item.kind === 'video' && (
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-xl transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <Icon name="play" className="h-5 w-5" />
        </span>
      )}
      {showMeta && (
        <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 pt-14 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
          <span className="font-display text-lg leading-snug">{t(item.title)}</span>
          <span className="text-xs text-white/65">{t(cat.label)} · {t(item.format)}</span>
        </span>
      )}
    </button>
  );
}

export function CountUp({ to, className = '' }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);
  return <span ref={ref} className={`tabular-nums ${className}`} dir="ltr">{n}</span>;
}
