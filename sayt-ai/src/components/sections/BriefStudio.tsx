'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { useFinePointer, useMediaQuery, usePrefersReducedMotion } from '@/lib/useReducedMotion';

/** Poster frames used as storyboard thumbnails in each sample brief. */
const boards = [
  ['ugc-skincare', 'influencer-lifestyle', 'product-fragrance'],
  ['influencer-day', 'celebrity-launch', 'influencer-unboxing'],
  ['brand-opening', 'social-food', 'ugc-coffee'],
];

/**
 * "What sets us apart" — headline and the three creators on the reading side,
 * a glass campaign brief on the other, floating inside a slow orbital system
 * (rings, travelling lights, breathing glows) drawn and animated in code.
 */
export function BriefStudio() {
  const { c, rtl } = useLocale();
  const b = c.brief;
  const [i, setI] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();
  const wide = useMediaQuery('(min-width: 768px)');

  // pointer parallax: -1..1 on both axes, smoothed
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || !fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const reset = () => { mx.set(0); my.set(0); };

  const cardRX = useTransform(sy, (v) => v * -3);
  const cardRY = useTransform(sx, (v) => v * 4);

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
    <div onPointerMove={onMove} onPointerLeave={reset} className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
      {/* reading side: headline + creators */}
      <motion.div
        className="relative z-10 lg:col-span-5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker mb-5">{c.services.kicker}</p>
        <h2 id="services-title" className="font-display text-[clamp(2.2rem,4.4vw,3.9rem)] leading-[1.22] [text-wrap:balance]">
          <span className="block">{c.services.title}</span>
          <span className="brief-gradient block">{c.services.titleB}</span>
        </h2>
        <p className="mt-6 max-w-md leading-8 text-white/65">{b.lead}</p>

        <div role="tablist" aria-label={b.title} aria-orientation="vertical" onKeyDown={onKey} className="mt-10 grid gap-1.5">
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
                className={`group relative flex min-h-[60px] items-center gap-5 rounded-2xl px-5 text-start transition-colors duration-300 ${on ? 'text-white' : 'text-white/45 hover:bg-white/[.03] hover:text-white/80'}`}
              >
                {on && (
                  <motion.span
                    layoutId="brief-tab"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    className="absolute inset-0 rounded-2xl border border-brand/70 bg-gradient-to-l from-brand/25 via-indigo-700/20 to-ink-800/40 shadow-[0_0_0_1px_rgba(147,197,253,.08),0_10px_40px_-8px_rgba(37,99,235,.55)] rtl:bg-gradient-to-l ltr:bg-gradient-to-r"
                  />
                )}
                <span className={`relative font-display text-sm ${on ? 'text-sky' : 'text-sky/50'}`} dir="ltr">{String.fromCharCode(65 + k)}</span>
                <span className="relative font-display text-[clamp(1.25rem,2vw,1.6rem)]">{x.who}</span>
                <span aria-hidden className={`relative ms-auto h-2.5 w-2.5 rounded-full bg-white transition-all duration-500 ${on ? 'opacity-100 shadow-[0_0_14px_4px_rgba(196,181,253,.7)]' : 'scale-50 opacity-0'}`} />
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* the brief, inside its orbital system */}
      <div className="relative lg:col-span-7">
        <Orbits sx={sx} sy={sy} animate={!reduced} full={wide} />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-[640px] [perspective:1400px]"
        >
          {/* sheet underneath, like the next brief in the stack */}
          <div aria-hidden className="absolute inset-x-6 -bottom-4 h-full rounded-[22px] border border-white/[.06] bg-ink-800/40 backdrop-blur-sm" />
          <motion.article
            id="brief-doc"
            role="tabpanel"
            aria-labelledby={`brief-tab-${i}`}
            style={{ rotateX: cardRX, rotateY: cardRY }}
            className="brief-glass relative overflow-hidden rounded-[22px] p-6 sm:p-9"
          >
            {/* all three briefs share one grid cell, so switching never changes the card's size */}
            <div className="grid">
              {b.tabs.map((tab, k) => {
                const on = k === i;
                return (
                  <motion.div
                    key={tab.who}
                    aria-hidden={!on}
                    inert={!on}
                    initial={false}
                    animate={on ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: rtl ? -18 : 18, filter: 'blur(8px)' }}
                    transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: on && !reduced ? 0.08 : 0 }}
                    className="[grid-area:1/1]"
                    style={{ pointerEvents: on ? 'auto' : 'none' }}
                  >
                    <BriefBody tab={tab} frames={boards[k]} />
                  </motion.div>
                );
              })}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </div>
  );
}

function BriefBody({ tab, frames }: { tab: ReturnType<typeof useLocale>['c']['brief']['tabs'][number]; frames: string[] }) {
  const { c } = useLocale();
  const b = c.brief;
  return (
    <>
      <header className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-xs text-white/50">{b.doc}</p>
          <p className="mt-1 font-display text-2xl sm:text-[1.7rem]">{tab.who}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/15 bg-white/[.04] px-3.5 py-1 text-xs text-white/70">{b.sample}</span>
      </header>

      <dl className="grid gap-x-8 gap-y-4 py-6 sm:grid-cols-[6.5rem_1fr]">
        <dt className="text-sm text-white/50 sm:pt-0.5">{b.fields.audience}</dt>
        <dd className="min-w-0 leading-7 text-white/90">{tab.audience}</dd>
        <dt className="text-sm text-white/50 sm:pt-0.5">{b.fields.voice}</dt>
        <dd className="min-w-0 leading-7 text-white/90">{tab.voice}</dd>
        <dt className="text-sm text-white/50 sm:self-center">{b.fields.idea}</dt>
        <dd className="brief-idea flex min-w-0 items-center justify-between gap-4 rounded-xl px-4 py-3 leading-7 text-white">
          <span>{tab.idea}</span>
          <span aria-hidden className="text-lg text-lilac drop-shadow-[0_0_8px_rgba(196,181,253,.9)]">✦</span>
        </dd>
      </dl>

      <div className="border-t border-white/10 pt-5">
        <p className="mb-3 text-sm text-white/50">{b.fields.scenes}</p>
        <ol className="grid grid-cols-3 gap-3 sm:gap-4">
          {tab.scenes.map((s, k) => (
            <li key={s} className="group min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src={asset(`media/posters/${frames[k]}.jpg`)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                <span className="absolute end-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-semibold text-ink-900 shadow" dir="ltr">{k + 1}</span>
              </div>
              <p className="mt-2.5 text-sm leading-5 text-white/75">{s}</p>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 flex flex-wrap items-baseline gap-x-3 border-t border-white/10 pt-4 text-sm">
        <span className="text-white/50">{b.fields.measure}</span>
        <span className="font-semibold text-white">{tab.measure}</span>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbital system                                                     */
/* ------------------------------------------------------------------ */

/** Ellipses in a 1000×800 field centred on the card. */
const rings = [
  { rx: 470, ry: 300, tilt: -18, spin: 60, dir: 1, trail: 46, dot: 38, mobile: true },
  { rx: 400, ry: 360, tilt: 12, spin: 46, dir: -1, trail: 58, dot: 52, mobile: true },
  { rx: 330, ry: 230, tilt: 34, spin: 52, dir: 1, trail: 0, dot: 44, mobile: false },
];

const ellipsePath = (rx: number, ry: number) => `M ${500 - rx} 400 a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

function Orbits({ sx, sy, animate, full }: { sx: MotionValue<number>; sy: MotionValue<number>; animate: boolean; full: boolean }) {
  const ringX = useTransform(sx, (v) => v * -18);
  const ringY = useTransform(sy, (v) => v * -12);
  const glowX = useTransform(sx, (v) => v * 34);
  const glowY = useTransform(sy, (v) => v * 24);
  const list = full ? rings : rings.filter((r) => r.mobile);

  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-[30%] -inset-y-[25%] -z-0 md:-inset-x-[22%] md:-inset-y-[20%]">
      {/* breathing light sources */}
      <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
        <span className="orbit-glow absolute left-[14%] top-[10%] h-[42%] w-[38%] rounded-full bg-[radial-gradient(closest-side,rgba(167,139,250,.5),transparent)] blur-2xl" />
        <span className="orbit-glow orbit-glow-late absolute bottom-[6%] right-[12%] h-[46%] w-[42%] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,.5),transparent)] blur-2xl" />
        <span className="orbit-glow absolute bottom-[18%] left-[6%] h-[30%] w-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,.26),transparent)] blur-3xl" />
      </motion.div>

      {/* rings, each turning slowly on its own tilt */}
      <motion.svg style={{ x: ringX, y: ringY }} viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c4b5fd" stopOpacity=".75" />
            <stop offset=".5" stopColor="#93c5fd" stopOpacity=".18" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity=".65" />
          </linearGradient>
          <radialGradient id="orbit-dot">
            <stop offset="0" stopColor="#fff" />
            <stop offset=".35" stopColor="#e0e7ff" stopOpacity=".9" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>
        {list.map((r, k) => {
          const d = ellipsePath(r.rx, r.ry);
          return (
            <g key={k} transform={`rotate(${r.tilt} 500 400)`}>
              <g>
                {animate && (
                  <animateTransform attributeName="transform" type="rotate" from="0 500 400" to={`${360 * r.dir} 500 400`} dur={`${r.spin}s`} repeatCount="indefinite" />
                )}
                <path id={`orbit-${k}`} d={d} fill="none" stroke="url(#orbit-stroke)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                {/* a fine dotted echo just inside the ring */}
                <path d={ellipsePath(r.rx - 14, r.ry - 10)} fill="none" stroke="#c4b5fd" strokeOpacity=".14" strokeWidth="1.4" strokeDasharray="1 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                {animate && r.trail > 0 && (
                  <path
                    d={d}
                    pathLength={100}
                    fill="none"
                    stroke="#e0e7ff"
                    strokeOpacity=".55"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="7 93"
                    vectorEffect="non-scaling-stroke"
                    className="orbit-trail"
                    style={{ animationDuration: `${r.trail}s` }}
                  />
                )}
                {animate ? (
                  <circle r="9" fill="url(#orbit-dot)">
                    <animateMotion dur={`${r.trail || r.dot}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#orbit-${k}`} />
                    </animateMotion>
                  </circle>
                ) : (
                  <circle r="9" cx={500 + r.rx} cy="400" fill="url(#orbit-dot)" />
                )}
                {/* a second, quieter light on the opposite side */}
                {animate && full && (
                  <circle r="5" fill="url(#orbit-dot)" opacity=".7">
                    <animateMotion dur={`${r.dot * 1.4}s`} begin={`-${r.dot * 0.7}s`} repeatCount="indefinite">
                      <mpath href={`#orbit-${k}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            </g>
          );
        })}
        {/* the bright sweeping arc low on the reading-far side */}
        <path d="M 40 520 Q 160 760 520 820" fill="none" stroke="url(#orbit-stroke)" strokeWidth="3" strokeLinecap="round" className="orbit-arc" />
      </motion.svg>
    </div>
  );
}
