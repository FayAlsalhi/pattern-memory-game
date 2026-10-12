'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { playback } from '@/lib/playback';
import { usePrefersReducedMotion } from '@/lib/useReducedMotion';
import { useLocale } from '@/lib/locale';
import type { MediaItem } from '@/content/types';
import { VideoSources } from './VideoSources';

type Props = {
  item: MediaItem;
  className?: string;
  /** Load the file immediately (above-the-fold), otherwise when near the viewport. */
  eager?: boolean;
  /** Extra playback priority, e.g. a hovered card or the centre hero phone. */
  boost?: number;
  /** Whether this preview may autoplay at all. */
  autoPlay?: boolean;
};

/**
 * Muted, looping, inline preview video. Lazy-loads near the viewport, plays
 * only while visible and within the global playback budget, and falls back
 * to its poster when autoplay is blocked, motion is reduced, or the file fails.
 */
export function SmartVideo({ item, className = '', eager = false, boost = 0, autoPlay = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();
  const { c, t } = useLocale();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const off = playback.register(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        playback.update(el, { ratio: e.isIntersecting ? e.intersectionRatio : 0 });
      },
      { rootMargin: '200px 0px', threshold: [0, 0.15, 0.4, 0.7, 1] },
    );
    io.observe(el);
    return () => { io.disconnect(); off(); };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (el) playback.update(el, { wants: autoPlay && !reduced && !failed, boost });
  }, [autoPlay, reduced, failed, boost]);

  useEffect(() => {
    const el = ref.current;
    if (!near || !el) return;
    el.load();
    const check = () => { if (el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setFailed(true); };
    const id = window.setTimeout(check, 4000);
    return () => window.clearTimeout(id);
  }, [near]);

  const poster = item.poster ? asset(item.poster) : undefined;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-ink-900 ${className}`}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={t(item.alt)}
        disablePictureInPicture
        onCanPlay={(e) => playback.update(e.currentTarget, {})}
      >
        {near && <VideoSources item={item} onFail={() => setFailed(true)} />}
      </video>
      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-ink-950/70 text-center text-sm text-white/80" role="status">
          {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
          <span className="relative rounded-full bg-black/50 px-3 py-1">{c.media.failed}</span>
        </div>
      )}
    </div>
  );
}
