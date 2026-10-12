'use client';

import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { clients, stats } from '@/content/site';
import { CountUp, Reveal } from '../ui/primitives';
import { SignalMark } from '../ui/SignalMark';

/** "What we did in the trial period" — the original Sayt numbers cards. */
export function Numbers() {
  const { c, t } = useLocale();
  return (
    <section aria-labelledby="numbers-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <Reveal className="text-center">
          <span className="inline-block rounded-full border border-brand/60 px-5 py-1.5 text-sm text-sky">{c.numbers.kicker}</span>
          <h2 id="numbers-title" className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4rem)] leading-[1.25]">
            <span className="block">{c.numbers.titleA}</span>
            <span className="block text-sky">{c.numbers.titleB}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {stats.map((s, i) => {
            const primary = i === 0;
            return (
              <Reveal key={s.value} delay={i * 0.1}>
                <div className={`relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[36px] p-7 md:min-h-[340px] md:p-9 ${primary ? 'bg-brand' : 'border border-ink-600 bg-ink-800'}`}>
                  <span className={`w-fit rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums ${primary ? 'bg-white/15 text-white' : 'bg-ink-600/70 text-sky'}`} dir="ltr">0{i + 1}</span>
                  <SignalMark className={`absolute left-7 top-[42%] -z-10 h-[38%] md:left-8 ${primary ? 'text-white/25' : 'text-ink-600'}`} />
                  <div>
                    <p className={`font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-none ${primary ? 'text-white' : 'text-sky'}`}>
                      <span dir="ltr" className="inline-block">
                        <span className={`me-1 align-[.35em] font-sans text-[.4em] font-normal ${primary ? 'text-white/60' : 'text-brand'}`}>+</span>
                        <CountUp to={s.value} />
                      </span>
                    </p>
                    <p className="mt-3 text-2xl">{t(s.label)}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Brands we've worked with — the client logos, as on the original site. */
export function Clients() {
  const { c, t } = useLocale();
  const row = [...clients, ...clients];
  return (
    <section id="clients" aria-labelledby="clients-title" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <Reveal>
          <p className="kicker mb-4">{c.clients.kicker}</p>
          <h2 id="clients-title" className="font-display text-[clamp(2rem,4.4vw,3.6rem)]">{c.clients.title}</h2>
        </Reveal>
      </div>
      <ul className="sr-only">{clients.map((x) => <li key={x.logo}>{t(x.name)}</li>)}</ul>
      <div aria-hidden className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee gap-5 [--marquee-speed:45s]">
          {row.map((x, i) => (
            <img key={i} src={asset(x.logo)} alt="" loading="lazy" width={160} height={160} className="h-28 w-28 shrink-0 rounded-3xl object-cover ring-1 ring-white/10 md:h-36 md:w-36" />
          ))}
        </div>
      </div>
    </section>
  );
}
