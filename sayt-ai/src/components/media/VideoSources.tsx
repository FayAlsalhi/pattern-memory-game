import { asset } from '@/lib/asset';
import type { MediaItem } from '@/content/types';

/** WebM first (smaller), MP4 fallback. `onFail` fires when the last source fails. */
export function VideoSources({ item, onFail }: { item: MediaItem; onFail?: () => void }) {
  return (
    <>
      {item.webm && <source src={asset(item.webm)} type="video/webm" />}
      <source src={asset(item.src)} type="video/mp4" onError={onFail} />
    </>
  );
}
