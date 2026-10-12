'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { asset } from '@/lib/asset';
import { useLocale } from '@/lib/locale';
import { playback } from '@/lib/playback';
import { categories } from '@/content/media';
import type { MediaItem } from '@/content/types';
import { PlaceholderBadge, ratioClass } from './Media';
import { VideoSources } from './VideoSources';
import { Icon } from '../ui/Icon';

type Ctx = { open: (items: MediaItem[], index: number) => void };
const ViewerContext = createContext<Ctx>({ open: () => {} });
export const useViewer = () => useContext(ViewerContext);

/** Sound preference persists while the page is open once the user opts in. */
let soundOn = true;

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ items: MediaItem[]; index: number } | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback((items: MediaItem[], index: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setState({ items, index });
  }, []);
  const close = useCallback(() => {
    setState(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);

  return (
    <ViewerContext.Provider value={{ open }}>
      {children}
      <ViewerDialog state={state} setIndex={(index) => setState((s) => (s ? { ...s, index } : s))} onClose={close} />
    </ViewerContext.Provider>
  );
}

function ViewerDialog({ state, setIndex, onClose }: {
  state: { items: MediaItem[]; index: number } | null; setIndex: (i: number) => void; onClose: () => void;
}) {
  const { c, t, rtl } = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(!soundOn);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  const item = state ? state.items[state.index] : null;
  const count = state?.items.length ?? 0;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (state && !d.open) { d.showModal(); playback.suspend(true); document.documentElement.classList.add('lock'); }
    if (!state && d.open) d.close();
  }, [state]);

  useEffect(() => { setFailed(false); setProgress(0); }, [item?.id]);

  // try with sound (we are inside a user gesture); fall back to muted
  useEffect(() => {
    const v = video.current;
    if (!v || !item || item.kind !== 'video') return;
    v.muted = !soundOn;
    setMuted(v.muted);
    v.play().catch(() => { v.muted = true; setMuted(true); v.play().catch(() => {}); });
  }, [item]);

  const step = useCallback((d: number) => { if (state) setIndex((state.index + d + count) % count); }, [state, count, setIndex]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!item) return;
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === next && count > 1) { e.preventDefault(); step(1); }
    else if (e.key === prev && count > 1) { e.preventDefault(); step(-1); }
    else if ((e.key === ' ' || e.key === 'k') && item.kind === 'video' && (e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') { e.preventDefault(); toggle(); }
    else if (e.key === 'm') toggleMute();
  };

  const toggle = () => { const v = video.current; if (v) v.paused ? v.play().catch(() => {}) : v.pause(); };
  const toggleMute = () => { const v = video.current; if (!v) return; v.muted = !v.muted; soundOn = !v.muted; setMuted(v.muted); };
  const fullscreen = () => {
    const el = stage.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
    else v?.webkitEnterFullscreen?.(); // iOS Safari
  };

  const vertical = item ? ['9:16', '4:5', '1:1'].includes(item.aspect) : false;

  return (
    <dialog
      ref={dialog}
      className="viewer m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-ink-950/90 backdrop:backdrop-blur-xl"
      aria-label={item ? t(item.title) : undefined}
      onClose={() => { playback.suspend(false); document.documentElement.classList.remove('lock'); onClose(); }}
      onKeyDown={onKey}
      onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}
    >
      {item && (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-16 md:py-10" dir={rtl ? 'rtl' : 'ltr'}>
          <button
            onClick={() => dialog.current?.close()}
            className="ctl pointer-events-auto absolute end-4 top-4 z-10 md:end-6 md:top-6"
            aria-label={c.media.close}
            autoFocus
          >
            <Icon name="close" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              ref={stage}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto relative overflow-hidden rounded-3xl bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10 ${
                vertical ? 'h-[min(78dvh,calc((100vw-2rem)*16/9))]' : 'w-[min(92vw,calc(78dvh*16/9))]'
              } ${ratioClass[item.aspect]}`}
            >
              {item.kind === 'video' ? (
                <>
                  <video
                    ref={video}
                    poster={item.poster ? asset(item.poster) : undefined}
                    className="h-full w-full object-cover"
                    playsInline
                    loop
                    onClick={toggle}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
                    aria-label={t(item.alt)}
                  >
                    <VideoSources item={item} onFail={() => setFailed(true)} />
                  </video>
                  {failed && <p role="alert" className="absolute inset-0 grid place-items-center bg-black/60">{c.media.failed}</p>}
                </>
              ) : (
                <img src={asset(item.src)} alt={t(item.alt)} className="h-full w-full object-cover" />
              )}
              <PlaceholderBadge item={item} className="absolute left-3 top-3" />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-3">
            {item.kind === 'video' && (
              <div className="flex items-center gap-2">
                <button className="ctl" onClick={toggle} aria-label={playing ? c.media.pause : c.media.play}><Icon name={playing ? 'pause' : 'play'} /></button>
                <button className="ctl" onClick={toggleMute} aria-label={muted ? c.media.unmute : c.media.mute} aria-pressed={!muted}><Icon name={muted ? 'muted' : 'sound'} /></button>
                <input
                  type="range" min={0} max={1000} value={Math.round(progress * 1000)} dir="ltr"
                  aria-label={t(item.title)}
                  className="scrub mx-1 flex-1"
                  onChange={(e) => { const v = video.current; if (v && v.duration) v.currentTime = (Number(e.target.value) / 1000) * v.duration; }}
                />
                <button className="ctl" onClick={fullscreen} aria-label={c.media.fullscreen}><Icon name="expand" /></button>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-xl">{t(item.title)}</p>
                <p className="text-sm text-white/60">
                  {t(categories.find((x) => x.id === item.category)!.label)} · {t(item.format)}
                  {item.brand && <> · {item.brand}</>}
                  {item.creator && <> · {item.creator}</>}
                </p>
              </div>
              {count > 1 && (
                <div className="flex shrink-0 items-center gap-2">
                  <button className="ctl" onClick={() => step(-1)} aria-label={c.media.prev}><Icon name="chevron" className="rtl:rotate-0 ltr:rotate-180" /></button>
                  <span className="tabular-nums text-sm text-white/60" aria-live="polite">{state!.index + 1}/{count}</span>
                  <button className="ctl" onClick={() => step(1)} aria-label={c.media.next}><Icon name="chevron" className="rtl:rotate-180 ltr:rotate-0" /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
