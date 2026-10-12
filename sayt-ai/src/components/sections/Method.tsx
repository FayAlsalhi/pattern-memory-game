'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { useMediaQuery, usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { byId } from '@/content/media';
import { method } from '@/content/site';
import { Media } from '../media/Media';
import { Reveal } from '../ui/primitives';

/**
 * How we choose the influencer — told as a campaign board that fills up as you
 * scroll: the project's needs, the creator's content, their audience, the
 * signed commitment, and finally threads pulling it all into one campaign.
 * Desktop pins the board; phones and reduced motion get the same board,
 * already complete, as a vertical sequence.
 */
export function Method() {
  const { c, t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const pinned = wide && !reduced;
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setStep(p > 0.8 ? 4 : Math.min(3, Math.floor(Math.max(0, p - 0.04) / 0.19))));

  const intro = (
    <>
      <p className="kicker mb-4">{c.method.kicker}</p>
      <h2 id="method-title" className="font-display text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.18] [text-wrap:balance]">{c.method.title}</h2>
      <p className="mt-5 max-w-sm leading-8 text-white/60">{c.method.principle}</p>
    </>
  );

  if (!pinned) {
    return (
      <section id="method" ref={section} aria-labelledby="method-title" className="relative scroll-mt-20 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <Reveal>{intro}</Reveal>
          <ol className="mt-14 grid gap-14 md:grid-cols-2 md:gap-x-10">
            {method.map((m, i) => (
              <li key={i} className="grid gap-5">
                <StepText i={i} title={t(m.title)} body={t(m.body)} active />
                <Reveal className="relative rounded-[22px] bg-ink-800/70 p-6 ring-1 ring-white/10 fabric-weave">
                  <Note i={i} />
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-14">
            <Outcome />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="method" ref={section} aria-labelledby="method-title" className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-10 px-8 pt-16">
          <div className="col-span-4">
            {intro}
            <ol className="mt-10 grid gap-1">
              {method.map((m, i) => (
                <li key={i}><StepText i={i} title={t(m.title)} body={t(m.body)} active={step === i} done={step > i} compact /></li>
              ))}
            </ol>
          </div>
          <Board progress={scrollYProgress} step={step} />
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

const spots = [
  { cls: 'right-[5%] top-[7%] w-[34%] -rotate-2', pin: [76, 9] },   // project needs
  { cls: 'left-[5%] top-[9%] w-[37%] rotate-[1.5deg]', pin: [24, 11] }, // creator content
  { cls: 'right-[9%] bottom-[7%] w-[27%] rotate-[2.5deg]', pin: [77, 66] }, // audience
  { cls: 'left-[8%] bottom-[9%] w-[29%] -rotate-[2.5deg]', pin: [22, 68] }, // commitment
];

function Board({ progress, step }: { progress: MotionValue<number>; step: number }) {
  const { c } = useLocale();
  const threads = useTransform(progress, [0.76, 0.9], [0, 1]);
  const center = useTransform(progress, [0.82, 0.95], [0, 1]);
  const centerScale = useTransform(center, [0, 1], [0.85, 1]);
  return (
    <div className="relative col-span-8 h-[min(76vh,720px)] overflow-hidden rounded-[28px] bg-ink-800/80 shadow-[inset_0_0_80px_rgba(0,0,0,.55)] ring-1 ring-white/10">
      <div aria-hidden className="fabric-weave absolute inset-0 opacity-80" />
      <div className="absolute inset-x-6 top-4 flex items-center justify-between text-xs text-white/40">
        <span>{c.method.board}</span>
        <span>{c.brief.sample}</span>
      </div>

      {/* threads drawn last, pulling every note into the campaign */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
        {spots.map((s, k) => (
          <motion.path
            key={k}
            d={`M${s.pin[0]} ${s.pin[1]} Q ${(s.pin[0] + 50) / 2} ${(s.pin[1] + 50) / 2 + (k % 2 ? 8 : -8)} 50 46`}
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
          <span aria-hidden className="absolute left-1/2 top-0 z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky shadow-[0_2px_6px_rgba(0,0,0,.6)]" />
          <Note i={k} />
        </motion.div>
      ))}

      <motion.div style={{ opacity: center, scale: centerScale }} className="absolute left-1/2 top-[46%] z-20 w-[34%] -translate-x-1/2 -translate-y-1/2">
        <Outcome compact />
      </motion.div>
    </div>
  );
}

/** The four artefacts pinned to the board. */
function Note({ i }: { i: number }) {
  const { c } = useLocale();
  const n = c.method.notes;
  if (i === 0) {
    return (
      <div className="rounded-[4px] bg-sand p-4 text-ink-900 shadow-xl sm:p-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          {n.need.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-ink-900/50">{k}</dt>
              <dd className="border-b border-dashed border-ink-900/25 font-serif">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (i === 1) {
    const frames = ['influencer-lifestyle', 'social-food', 'influencer-day', 'ugc-coffee', 'celebrity-launch', 'ugc-tea'];
    return (
      <div className="rounded-[4px] bg-[#0b0b10] p-2.5 shadow-xl">
        <div className="grid grid-cols-3 gap-1.5">
          {frames.map((f, k) => (
            <div key={f} className={`relative aspect-[3/4] overflow-hidden rounded-[2px] ${k === 0 ? 'ring-2 ring-sky ring-offset-2 ring-offset-[#0b0b10]' : 'opacity-60 grayscale'}`}>
              <img src={asset(`media/posters/${f}.jpg`)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
        <p className="px-1 pt-2 text-xs text-sky">✓ {n.content}</p>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="rounded-[3px] bg-sky p-4 text-ink-900 shadow-xl sm:p-5">
        <ul className="grid gap-1.5 font-serif text-sm">
          {n.audience.map((a) => <li key={a} className="flex gap-2"><span aria-hidden>✓</span>{a}</li>)}
        </ul>
      </div>
    );
  }
  return (
    <div className="relative rounded-[4px] bg-sand p-4 pe-20 text-ink-900 shadow-xl sm:p-5 sm:pe-24">
      <p className="text-xs text-ink-900/50">{n.pledge}</p>
      <p className="mt-2 h-6 border-b border-ink-900/30 font-serif text-sm">— — —</p>
      <span className="absolute end-3 top-1/2 grid h-16 w-16 -translate-y-1/2 rotate-[-14deg] place-items-center rounded-full border-2 border-brand text-center font-display text-sm text-brand sm:h-20 sm:w-20">
        {n.stamp}
      </span>
    </div>
  );
}

function Outcome({ compact }: { compact?: boolean }) {
  const { c } = useLocale();
  return (
    <figure className={compact ? '' : 'mx-auto max-w-2xl'}>
      <div className="relative aspect-video overflow-hidden rounded-[6px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] ring-4 ring-sand">
        <Media item={byId('film-launch')} />
      </div>
      <figcaption className={`mt-3 text-center font-display ${compact ? 'text-lg' : 'text-2xl'} type-grain`}>{c.method.outcome}</figcaption>
    </figure>
  );
}
