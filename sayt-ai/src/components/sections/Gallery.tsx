'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { byPlacement, categories } from '@/content/media';
import type { CategoryId } from '@/content/types';
import { MediaCard, SectionHeading } from '../ui/primitives';

/** Scene 04 — filterable editorial masonry of vertical ads, reels, films and stills. */
export function Gallery() {
  const { c, t } = useLocale();
  const all = byPlacement('gallery');
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const items = useMemo(() => (filter === 'all' ? all : all.filter((m) => m.category === filter)), [all, filter]);
  const counts = useMemo(() => Object.fromEntries(categories.map((k) => [k.id, all.filter((m) => m.category === k.id).length])), [all]);

  const chips: Array<{ id: CategoryId | 'all'; label: string; n: number }> = [
    { id: 'all', label: c.gallery.all, n: all.length },
    ...categories.map((k) => ({ id: k.id, label: t(k.label), n: counts[k.id] })),
  ];

  return (
    <section id="ugc" aria-labelledby="ugc-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading id="ugc-title" kicker={c.gallery.kicker} title={c.gallery.title} />

        <div className="sticky top-[72px] z-20 -mx-5 mt-10 px-5 pb-6 pt-3 md:mx-0 md:px-0">
          <div role="group" aria-label={c.nav.ugc} className="no-scrollbar flex gap-2 overflow-x-auto">
            {chips.map((ch) => {
              const on = filter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setFilter(ch.id)}
                  aria-pressed={on}
                  disabled={ch.n === 0}
                  className={`relative flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors disabled:opacity-35 ${on ? 'border-transparent text-ink-900' : 'border-white/15 bg-ink-950/55 text-white/75 backdrop-blur-md hover:border-white/35 hover:text-white'}`}
                >
                  {on && <motion.span layoutId="chip" className="absolute inset-0 -z-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="relative">{ch.label}</span>
                  <span className={`relative text-xs tabular-nums ${on ? 'text-ink-900/60' : 'text-white/40'}`}>{ch.n}</span>
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">{c.gallery.count(items.length)}</p>
        </div>

        <LayoutGroup>
          <motion.ul layout className="columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-3 break-inside-avoid sm:mb-4"
                >
                  <MediaCard item={item} list={items} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
        {items.length === 0 && <p className="py-20 text-center text-white/50">{c.gallery.empty}</p>}
      </div>
    </section>
  );
}
