'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byId } from '@/content/media';
import { method } from '@/content/site';
import { Media } from '../media/Media';

/**
 * How we choose the influencer — told as a campaign board that fills up as you
 * scroll: the project's needs, the creator's content, their audience, the
 * signed commitment, and finally threads pulling it all into one campaign.
 * The board pins on every screen size (a portrait board on phones); with
 * reduced motion it is shown complete, without pinning.
 */
export function Method() {
  const { c, t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setStep(p > 0.8 ? 4 : Math.min(3, Math.floor(Math.max(0, p - 0.04) / 0.19))));

  const title = (cls: string) => (
    <>
      <p className="kicker mb-3 lg:mb-4">{c.method.kicker}</p>
      <h2 id="method-title" className={`font-display leading-[1.18] [text-wrap:balance] ${cls}`}>{c.method.title}</h2>
    </>
  );

  if (reduced) {
    return (
      <section id="method" ref={section} aria-labelledby="method-title" className="relative scroll-mt-20 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          {title('text-[clamp(2rem,3.8vw,3.4rem)]')}
          <p className="mt-5 max-w-sm leading-8 text-white/60">{c.method.principle}</p>
          <ol className="mt-8 grid gap-x-10 sm:grid-cols-2">
            {method.map((m, i) => <li key={i}><StepText i={i} title={t(m.title)} body={t(m.body)} active /></li>)}
          </ol>
          <div className="mt-10"><Board progress={scrollYProgress} step={4} compact={!wide} complete /></div>
        </div>
      </section>
    );
  }

  if (!wide) {
    // phones & tablets: a portrait board pinned under a compact header
    const current = method[Math.min(step, 3)];
    return (
      <section id="method" ref={section} aria-labelledby="method-title" className="relative h-[460vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-4 pb-4 pt-[84px] sm:px-8">
          {title('text-[clamp(1.6rem,6.4vw,2.4rem)]')}

          <div className="mt-3 flex items-center gap-1.5" aria-hidden>
            {method.map((_, k) => (
              <span key={k} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= k ? 'bg-sky' : 'bg-white/15'}`} />
            ))}
          </div>

          <div className="relative mt-3 min-h-[4.5rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step >= 4 ? 'done' : step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                {step >= 4 ? (
                  <>
                    <p className="font-display text-lg text-white">{c.method.outcome}</p>
                    <p className="text-sm leading-6 text-white/60">{c.method.principle}</p>
                  </>
                ) : (
                  <>
                    <p className="flex items-baseline gap-2 font-display text-lg text-white">
                      <span className="text-sm text-sky" dir="ltr">0{Math.min(step, 3) + 1}</span>
                      {t(current.title)}
                    </p>
                    <p className="text-sm leading-6 text-white/60">{t(current.body)}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-2 min-h-0 flex-1">
            <Board progress={scrollYProgress} step={step} compact />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="method" ref={section} aria-labelledby="method-title" className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-10 px-8 pt-16">
          <div className="col-span-4">
            {title('text-[clamp(2rem,3.8vw,3.4rem)]')}
            <p className="mt-5 max-w-sm leading-8 text-white/60">{c.method.principle}</p>
            <ol className="mt-10 grid gap-1">
              {method.map((m, i) => (
                <li key={i}><StepText i={i} title={t(m.title)} body={t(m.body)} active={step === i} done={step > i} compact /></li>
              ))}
            </ol>
          </div>
          <div className="col-span-8 h-[min(76vh,720px)]">
            <Board progress={scrollYProgress} step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepText({ i, title, body, active, done, compact }: { i: number; title: string; body: string; active: boolean; done?: boolean; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-[2rem_1fr] gap-x-3 border-t border-white/10 py-3 transition-opacity duration-500 ${compact && !active ? (done ? 'opacity-60' : 'opacity-30') : 'opacity-100'}`}>
      <span className={`font-display text-sm ${active || done ? 'text-sky' : 'text-white/50'}`} dir="ltr">0{i + 1}</span>
      <div className="min-w-0">
        <h3 className="font-display text-xl">{title}</h3>
        <motion.p
          initial={false}
          animate={{ height: !compact || active ? 'auto' : 0, opacity: !compact || active ? 1 : 0 }}
          className="overflow-hidden leading-7 text-white/60"
        >
          {body}
        </motion.p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Landscape board (desktop) and portrait board (phones). */
const layouts = {
  wide: [
    { cls: 'right-[5%] top-[7%] w-[34%] -rotate-2', pin: [76, 9] },
    { cls: 'left-[5%] top-[9%] w-[37%] rotate-[1.5deg]', pin: [24, 11] },
    { cls: 'right-[9%] bottom-[7%] w-[27%] rotate-[2.5deg]', pin: [77, 66] },
    { cls: 'left-[8%] bottom-[9%] w-[29%] -rotate-[2.5deg]', pin: [22, 68] },
  ],
  compact: [
    { cls: 'right-[3%] top-[8%] w-[51%] -rotate-2', pin: [72, 9] },
    { cls: 'left-[3%] top-[7%] w-[44%] rotate-[1.5deg]', pin: [25, 8] },
    { cls: 'right-[3%] bottom-[4%] w-[50%] rotate-[2.5deg]', pin: [72, 73] },
    { cls: 'left-[3%] bottom-[5%] w-[48%] -rotate-[2.5deg]', pin: [27, 76] },
  ],
};

function Board({ progress, step, compact = false, complete = false }: { progress: MotionValue<number>; step: number; compact?: boolean; complete?: boolean }) {
  const { c } = useLocale();
  const spots = compact ? layouts.compact : layouts.wide;
  const live = useTransform(progress, [0.76, 0.9], [0, 1]);
  const centerLive = useTransform(progress, [0.82, 0.95], [0, 1]);
  const threads = complete ? 1 : live;
  const center = complete ? 1 : centerLive;
  const centerScale = useTransform(centerLive, [0, 1], [0.85, 1]);
  const centerY = compact ? 47 : 46;

  return (
    <div className={`relative w-full overflow-hidden rounded-[24px] bg-ink-800/80 shadow-[inset_0_0_80px_rgba(0,0,0,.55)] ring-1 ring-white/10 lg:rounded-[28px] ${complete ? (compact ? 'aspect-[3/4] max-h-[80vh]' : 'aspect-[16/10]') : 'h-full'}`}>
      <div aria-hidden className="fabric-weave absolute inset-0 opacity-80" />
      <div className="absolute inset-x-4 top-2.5 flex items-center justify-between text-[10px] text-white/40 lg:inset-x-6 lg:top-4 lg:text-xs">
        <span>{c.method.board}</span>
        <span>{c.brief.sample}</span>
      </div>

      {/* threads drawn last, pulling every note into the campaign */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
        {spots.map((s, k) => (
          <motion.path
            key={k}
            d={`M${s.pin[0]} ${s.pin[1]} Q ${(s.pin[0] + 50) / 2} ${(s.pin[1] + centerY) / 2 + (k % 2 ? 8 : -8)} 50 ${centerY}`}
            stroke="var(--color-sky)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            fill="none"
            style={{ pathLength: threads, opacity: threads }}
          />
        ))}
      </svg>

      {spots.map((s, k) => (
        <motion.div
          key={k}
          className={`absolute ${s.cls}`}
          initial={false}
          animate={step >= k ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.94 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span aria-hidden className="absolute left-1/2 top-0 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky shadow-[0_2px_6px_rgba(0,0,0,.6)] lg:h-3.5 lg:w-3.5" />
          <Note i={k} compact={compact} />
        </motion.div>
      ))}

      <motion.div
        style={{ opacity: center, scale: complete ? 1 : centerScale, top: `${centerY}%` }}
        className={`absolute left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 ${compact ? 'w-[64%]' : 'w-[34%]'}`}
      >
        <Outcome compact />
      </motion.div>
    </div>
  );
}

/** The four artefacts pinned to the board. */
function Note({ i, compact }: { i: number; compact: boolean }) {
  const { c } = useLocale();
  const n = c.method.notes;
  const text = compact ? 'text-[12px] leading-[1.5] sm:text-[13px]' : 'text-sm';
  const pad = compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5';
  if (i === 0) {
    return (
      <div className={`rounded-[4px] bg-sand text-ink-900 shadow-xl ${pad}`}>
        <dl className={`grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1.5 lg:gap-x-4 lg:gap-y-2 ${text}`}>
          {n.need.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-ink-900/50">{k}</dt>
              <dd className="min-w-0 border-b border-dashed border-ink-900/25 font-serif">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (i === 1) {
    const frames = ['influencer-lifestyle', 'social-food', 'influencer-day', 'ugc-coffee', 'celebrity-launch', 'ugc-tea'];
    return (
      <div className={`rounded-[4px] bg-[#0b0b10] shadow-xl ${compact ? 'p-1.5' : 'p-2.5'}`}>
        <div className={`grid grid-cols-3 ${compact ? 'gap-1' : 'gap-1.5'}`}>
          {frames.map((f, k) => (
            <div key={f} className={`relative aspect-[3/4] overflow-hidden rounded-[2px] ${k === 0 ? 'ring-2 ring-sky ring-offset-1 ring-offset-[#0b0b10] lg:ring-offset-2' : 'opacity-60 grayscale'}`}>
              <img src={asset(`media/posters/${f}.jpg`)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <p className={`px-1 pt-1.5 text-sky ${compact ? 'text-[11px]' : 'pt-2 text-xs'}`}>✓ {n.content}</p>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className={`rounded-[3px] bg-sky text-ink-900 shadow-xl ${pad}`}>
        <ul className={`grid gap-1 font-serif lg:gap-1.5 ${text}`}>
          {n.audience.map((a) => <li key={a} className="flex gap-1.5"><span aria-hidden>✓</span>{a}</li>)}
        </ul>
      </div>
    );
  }
  return (
    <div className={`relative rounded-[4px] bg-sand text-ink-900 shadow-xl ${pad} ${compact ? 'pe-16 sm:pe-20' : 'pe-20 sm:pe-24'}`}>
      <p className={compact ? 'text-[11px] text-ink-900/50' : 'text-xs text-ink-900/50'}>{n.pledge}</p>
      <p className={`mt-1.5 border-b border-ink-900/30 font-serif ${compact ? 'h-5 text-[11px]' : 'mt-2 h-6 text-sm'}`}>— — —</p>
      <span className={`absolute end-2 top-1/2 grid -translate-y-1/2 rotate-[-14deg] place-items-center rounded-full border-2 border-brand text-center font-display text-brand ${compact ? 'h-12 w-12 text-[11px] sm:h-14 sm:w-14' : 'end-3 h-16 w-16 text-sm sm:h-20 sm:w-20'}`}>
        {n.stamp}
      </span>
    </div>
  );
}

function Outcome({ compact }: { compact?: boolean }) {
  const { c } = useLocale();
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] ring-4 ring-sand">
        <Media item={byId('film-launch')} />
      </div>
      <figcaption className={`type-grain mt-2 text-center font-display lg:mt-3 ${compact ? 'text-base lg:text-lg' : 'text-2xl'}`}>{c.method.outcome}</figcaption>
    </figure>
  );
}
