'use client';

import { useEffect, useRef } from 'react';
import {
  motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue,
} from 'motion/react';
import { useLocale } from '@/lib/locale';
import { usePrefersReducedMotion, useFinePointer } from '@/lib/useReducedMotion';
import { byPlacement, categories } from '@/content/media';
import { links, trust } from '@/content/site';
import type { MediaItem } from '@/content/types';
import { PhoneFrame } from '../media/PhoneFrame';
import { Media, PlaceholderBadge } from '../media/Media';
import { useViewer } from '../media/Viewer';
import { Icon } from '../ui/Icon';

/**
 * Layered composition. x/y are offsets from the stage centre in % of the
 * stage; depth drives parallax strength; spread is where the phone drifts
 * as the hero scrolls away.
 */
const layout = [
  { x: 0, y: 2, w: 1, rot: 0, ry: 0, z: 5, depth: 1, float: 6.5, spread: [0, -1], mobile: true },
  { x: -27, y: -6, w: 0.8, rot: -7, ry: 16, z: 4, depth: 0.7, float: 7.4, spread: [-1, -0.6], mobile: true },
  { x: 27, y: 8, w: 0.8, rot: 6, ry: -16, z: 4, depth: 0.75, float: 8.1, spread: [1, -0.5], mobile: true },
  { x: -48, y: 14, w: 0.62, rot: -12, ry: 24, z: 2, depth: 0.45, float: 9.2, spread: [-1.2, 0.2], mobile: false },
  { x: 47, y: -14, w: 0.6, rot: 11, ry: -24, z: 2, depth: 0.4, float: 8.7, spread: [1.2, 0.1], mobile: false },
];

export function Hero() {
  const { c, t, rtl } = useLocale();
  const items = byPlacement('hero').slice(0, layout.length);
  const section = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const { open } = useViewer();

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduced || !fine) return;
    const on = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [reduced, fine, px, py]);

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0]);

  return (
    <section ref={section} id="top" className="relative isolate min-h-[100svh] overflow-hidden pt-[72px]">
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1400px] items-center gap-6 px-5 pb-10 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-4">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 pt-6 text-center lg:pt-0 lg:text-start">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="kicker mb-5">
            {c.hero.eyebrow}
          </motion.p>
          <h1 className={`font-display leading-[1.12] tracking-[-0.01em] ${rtl ? 'text-[clamp(2.4rem,5.6vw,4.8rem)]' : 'text-[clamp(2.2rem,4.4vw,3.9rem)]'}`}>
            <motion.span className="block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              {c.hero.titleA}
            </motion.span>
            <motion.span className="type-grain block" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              {c.hero.titleB}
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="mx-auto mt-6 max-w-md text-lg leading-8 text-white/70 lg:mx-0">
            {c.hero.lead}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.75 }} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a href={links.startCampaign} target="_blank" rel="noopener" className="btn-primary text-lg">
              {c.cta.start}
              <Icon name="arrow" className="rtl:rotate-180" />
            </a>
            <a href={links.joinAsInfluencer} target="_blank" rel="noopener" className="btn-ghost">{c.cta.join}</a>
          </motion.div>
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="mt-10 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-white/55 lg:flex">
            {trust.map((x) => (
              <li key={x.value} className="flex items-center gap-2"><span className="font-semibold text-sky" dir="ltr">{x.value}</span>{t(x.label)}</li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="relative h-[min(118vw,620px)] [--phone-w:min(46vw,240px)] [perspective:1600px] sm:h-[640px] lg:h-[min(88svh,820px)] lg:[--phone-w:min(17.5vw,272px)]" role="group" aria-label={c.hero.tap}>
          {items.map((item, i) => (
            <FloatingPhone
              key={item.id}
              item={item}
              index={i}
              conf={layout[i]}
              pointer={[sx, sy]}
              scroll={scrollYProgress}
              reduced={reduced}
              onOpen={() => open(items, i)}
              label={c.media.open(t(item.title))}
              chip={t(categories.find((x) => x.id === item.category)!.label)}
            />
          ))}
          <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-xs text-white/45">{c.hero.tap}</p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute bottom-6 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[.3em] text-white/40 lg:flex rtl:translate-x-1/2">
        {c.hero.scroll}
        <span className="block h-10 w-px overflow-hidden bg-white/15"><span className="block h-1/2 w-full animate-[scrollhint_1.8s_ease-in-out_infinite] bg-white/70" /></span>
      </div>
      <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}

function FloatingPhone({ item, index, conf, pointer, scroll, reduced, onOpen, label, chip }: {
  item: MediaItem; index: number; conf: (typeof layout)[number];
  pointer: [MotionValue<number>, MotionValue<number>]; scroll: MotionValue<number>;
  reduced: boolean; onOpen: () => void; label: string; chip: string;
}) {
  const [sx, sy] = pointer;
  const k = reduced ? 0 : 1;
  const x = useTransform([sx, scroll] as MotionValue<number>[], ([p, s]: number[]) => k * (p * 26 * conf.depth + s * conf.spread[0] * 260));
  const y = useTransform([sy, scroll] as MotionValue<number>[], ([p, s]: number[]) => k * (p * 18 * conf.depth + s * (conf.spread[1] * 220 - 140 * conf.depth)));
  const rotY = useTransform(sx, (p) => conf.ry + k * p * 8);
  const rotX = useTransform(sy, (p) => k * -p * 6);
  const opacity = useTransform(scroll, [0, 0.85], [1, reduced ? 1 : 0.2]);

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 ${conf.mobile ? '' : 'hidden md:block'}`}
      style={{
        zIndex: conf.z,
        width: `calc(var(--phone-w) * ${conf.w})`,
        marginLeft: `${conf.x}%`,
        marginTop: `${conf.y}%`,
        x, y, opacity,
        translateX: '-50%', translateY: '-50%',
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 160, rotateX: 28 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.4, delay: 0.25 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
      <motion.div
        animate={reduced ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: conf.float, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label={label}
          style={{ rotateY: rotY, rotateX: rotX, rotateZ: conf.rot, transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.035 }}
          whileTap={{ scale: 0.97 }}
          className="group relative block w-full cursor-pointer rounded-[15%] text-start"
        >
          <PhoneFrame className={conf.z < 3 ? 'brightness-[.8] saturate-[.9]' : ''}>
            <Media item={item} eager={index < 3} boost={conf.z} />
            <PlaceholderBadge item={item} className="absolute left-[7%] top-[8.5%] z-10 scale-90" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-[7%] pt-[30%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="text-[clamp(10px,1vw,13px)] text-white/90">{chip}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-900"><Icon name="play" className="h-4 w-4" /></span>
            </span>
          </PhoneFrame>
          {/* soft coloured glow under each device */}
          <span aria-hidden className="absolute inset-x-[10%] -bottom-[6%] -z-10 h-[12%] rounded-[50%] bg-lilac/30 blur-2xl" />
        </motion.button>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}
