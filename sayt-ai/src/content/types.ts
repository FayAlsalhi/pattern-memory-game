export type Locale = 'ar' | 'en';

/** Localised string. Arabic is the source of truth; English is optional. */
export type L10n = { ar: string; en?: string };

export type CategoryId = 'ugc' | 'influencer' | 'celebrity' | 'product' | 'brand' | 'social';

export type AspectRatio = '9:16' | '16:9' | '4:5' | '5:4' | '1:1';

export interface MediaItem {
  /** Stable id, also used as the default file name under /public/media. */
  id: string;
  title: L10n;
  category: CategoryId;
  kind: 'video' | 'image';
  /**
   * Path relative to /public (no leading slash). For videos this is the
   * universal H.264 MP4, e.g. "media/video/x.mp4".
   */
  src: string;
  /** Optional VP9/AV1 WebM rendition, offered first when present (smaller files). */
  webm?: string;
  /** Poster frame for videos (required for videos). */
  poster?: string;
  aspect: AspectRatio;
  /** Short format label shown on cards, e.g. "Reel · 9:16". */
  format: L10n;
  /** Optional, only when the collaboration is real and authorised. */
  brand?: string;
  creator?: string;
  alt: L10n;
  caption?: L10n;
  order: number;
  featured?: boolean;
  /** Where the item appears. An item can appear in several scenes. */
  placements: Array<'hero' | 'featured' | 'creators' | 'gallery' | 'production' | 'services'>;
  /**
   * true while the file is a generated stand-in. Placeholders are always
   * badged in the UI and listed in MEDIA.md so they can be replaced.
   */
  placeholder?: boolean;
}

export interface Category {
  id: CategoryId;
  label: L10n;
}

export interface Client {
  name: L10n;
  logo: string;
}
