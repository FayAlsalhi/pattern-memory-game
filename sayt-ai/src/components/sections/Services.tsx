'use client';

import { useLocale } from '@/lib/locale';
import { asset } from '@/lib/asset';
import { byId, byPlacement } from '@/content/media';
import { clients, method, services, stats } from '@/content/site';
import { PhoneFrame } from '../media/PhoneFrame';
import { Media, PlaceholderBadge } from '../media/Media';
import { useViewer } from '../media/Viewer';
import { CountUp, Reveal, SectionHeading } from '../ui/primitives';

/** Scene 06 — the agency's existing services, shown with visual examples. */
export function Services() {
  const { c, t } = useLocale();
  const { open } = useViewer();
  const list = byPlacement('services');
  const [a, b, g, total] = c.services.equation;

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeading id="services-title" kicker={c.services.kicker} title={c.services.title} />

        <Reveal className="mt-12">
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 font-display text-[clamp(1.6rem,4vw,3rem)] text-white/90" aria-label={`${a} + ${b} + ${g} = ${total}`}>
            <span>{a}</span><span className="text-sky">+</span><span>{b}</span><span className="text-sky">+</span><span>{g}</span><span className="text-sky">=</span>
            <span className="type-grain">{total}</span>
          </p>
        </Reveal>

        <ol className="mt-16 divide-y divide-white/[.08] border-y border-white/[.08]">
          {services.map((s, i) => {
            const item = byId(s.media);
            const vertical = item.aspect === '9:16';
            return (
              <li key={s.n}>
                <Reveal className="grid items-center gap-6 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                  <span className="font-display text-sm text-sky md:col-span-1 md:text-base" dir="ltr">{s.n}</span>
                  <div className="md:col-span-6">
                    <h3 className="font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-tight">{t(s.title)}</h3>
                    <p className="mt-3 max-w-xl leading-8 text-white/65">{t(s.body)}</p>
                    <p className="mt-4 text-sm text-white/45">
                      {c.services.instead}: <span className="line-through decoration-white/40">{t(s.instead)}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => open(list, list.findIndex((m) => m.id === item.id))}
                    aria-label={c.media.open(t(item.title))}
                    className={`group justify-self-start md:col-span-5 md:justify-self-end ${vertical ? 'w-36 md:w-44' : 'w-full max-w-md'} ${i % 2 ? 'md:rotate-[1.5deg]' : 'md:rotate-[-1.5deg]'} transition-transform duration-500 hover:rotate-0`}
                  >
                    {vertical ? (
                      <PhoneFrame>
                        <Media item={item} />
                        <PlaceholderBadge item={item} className="absolute left-[7%] top-[8.5%] scale-75" />
                      </PhoneFrame>
                    ) : (
                      <span className="relative block aspect-video overflow-hidden rounded-2xl ring-1 ring-white/10">
                        <Media item={item} />
                        <PlaceholderBadge item={item} className="absolute left-3 top-3" />
                      </span>
                    )}
                  </button>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      <Method />
      <Numbers />
      <Clients />
    </section>
  );
}

function Method() {
  const { c, t } = useLocale();
  return (
    <div id="method" className="mx-auto mt-28 max-w-[1400px] scroll-mt-24 px-5 md:mt-40 md:px-8" aria-labelledby="method-title">
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="kicker mb-4">{c.method.kicker}</p>
          <h3 id="method-title" className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-tight">{c.method.title}</h3>
          <p className="mt-5 max-w-sm leading-8 text-white/60">{c.method.principle}</p>
          <blockquote className="mt-8 border-s-2 border-sky ps-4 font-display text-xl text-white/90">{c.hero.titleA} {c.hero.titleB}</blockquote>
        </Reveal>
        <ol className="grid gap-px overflow-hidden rounded-[28px] bg-white/[.08] ring-1 ring-white/[.08] sm:grid-cols-2 md:col-span-8">
          {method.map((m, i) => (
            <li key={i} className="bg-ink-900/80 p-7 backdrop-blur md:p-9">
              <Reveal delay={i * 0.06}>
                <span className="font-display text-5xl text-white/15" dir="ltr">0{i + 1}</span>
                <h4 className="mt-4 font-display text-2xl">{t(m.title)}</h4>
                <p className="mt-2 leading-7 text-white/60">{t(m.body)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Numbers() {
  const { c, t } = useLocale();
  return (
    <div className="mx-auto mt-28 max-w-[1400px] px-5 md:mt-36 md:px-8">
      <Reveal className="flex flex-wrap items-end justify-between gap-10 rounded-[32px] border border-white/[.08] bg-white/[.03] p-8 backdrop-blur md:p-14">
        <div>
          <p className="kicker mb-3">{c.numbers.kicker}</p>
          <h3 className="max-w-sm font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">{c.numbers.title}</h3>
        </div>
        <dl className="flex flex-wrap gap-12 md:gap-20">
          {stats.map((s) => (
            <div key={s.value}>
              <dt className="sr-only">{t(s.label)}</dt>
              <dd className="font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none"><span className="text-sky">+</span><CountUp to={s.value} /></dd>
              <dd className="mt-2 text-white/60">{t(s.label)}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}

function Clients() {
  const { c, t } = useLocale();
  const row = [...clients, ...clients];
  return (
    <div id="clients" className="mt-28 scroll-mt-24 md:mt-36" aria-labelledby="clients-title">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <p className="kicker mb-3">{c.clients.kicker}</p>
        <h3 id="clients-title" className="font-display text-[clamp(1.6rem,3vw,2.4rem)]">{c.clients.title}</h3>
      </div>
      <ul className="sr-only">{clients.map((x) => <li key={x.logo}>{t(x.name)}</li>)}</ul>
      <div aria-hidden className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee gap-5 [--marquee-speed:45s]">
          {row.map((x, i) => (
            <img key={i} src={asset(x.logo)} alt="" loading="lazy" width={160} height={160} className="h-28 w-28 shrink-0 rounded-3xl object-cover ring-1 ring-white/10 md:h-36 md:w-36" />
          ))}
        </div>
      </div>
    </div>
  );
}
