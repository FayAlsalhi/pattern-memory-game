'use client';

import { asset } from '@/lib/asset';
import { useLocale } from '@/lib/locale';
import type { MediaItem } from '@/content/types';
import { SmartVideo } from './SmartVideo';

export const ratioClass: Record<MediaItem['aspect'], string> = {
  '9:16': 'aspect-[9/16]',
  '16:9': 'aspect-video',
  '4:5': 'aspect-[4/5]',
  '5:4': 'aspect-[5/4]',
  '1:1': 'aspect-square',
};

/** Renders a media item (video preview or photo) filling its parent. */
export function Media({ item, eager, boost, autoPlay = true, className = '' }: {
  item: MediaItem; eager?: boolean; boost?: number; autoPlay?: boolean; className?: string;
}) {
  const { t } = useLocale();
  if (item.kind === 'video') return <SmartVideo item={item} eager={eager} boost={boost} autoPlay={autoPlay} className={className} />;
  return (
    <img
      src={asset(item.src)}
      alt={t(item.alt)}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/** Small, always-visible badge on generated stand-in media. */
export function PlaceholderBadge({ item, className = '' }: { item: MediaItem; className?: string }) {
  const { c } = useLocale();
  if (!item.placeholder) return null;
  return (
    <span className={`pointer-events-none inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2 py-0.5 text-[10px] leading-4 text-white/85 backdrop-blur ${className}`}>
      <span aria-hidden className="h-1 w-1 rounded-full bg-amber-300" />
      {c.media.placeholder}
    </span>
  );
}
