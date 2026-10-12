'use client';

/**
 * Global playback budget. Every in-page preview <video> registers here with
 * how visible it is; only the N most important ones play at once, the rest
 * stay paused on their poster. This keeps a media-heavy page smooth on
 * phones, and lets the full-screen viewer suspend every preview.
 */

type Entry = { el: HTMLVideoElement; ratio: number; boost: number; wants: boolean };

const entries = new Map<HTMLVideoElement, Entry>();
let suspended = false;
let scheduled = false;

const budget = () => (typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 7);

function apply() {
  scheduled = false;
  const active = suspended || document.hidden ? [] :
    [...entries.values()]
      .filter((e) => e.wants && e.ratio > 0.15)
      .sort((a, b) => b.boost + b.ratio - (a.boost + a.ratio))
      .slice(0, budget());
  const allowed = new Set(active.map((e) => e.el));
  for (const e of entries.values()) {
    if (allowed.has(e.el)) {
      if (e.el.paused) e.el.play().catch(() => { /* autoplay blocked — poster stays */ });
    } else if (!e.el.paused) {
      e.el.pause();
    }
  }
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(apply);
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', schedule);

export const playback = {
  register(el: HTMLVideoElement) {
    entries.set(el, { el, ratio: 0, boost: 0, wants: true });
    return () => { entries.delete(el); };
  },
  update(el: HTMLVideoElement, patch: Partial<Omit<Entry, 'el'>>) {
    const e = entries.get(el);
    if (!e) return;
    Object.assign(e, patch);
    schedule();
  },
  /** Pause every preview (e.g. while the full-screen viewer is open). */
  suspend(on: boolean) {
    suspended = on;
    schedule();
  },
};
