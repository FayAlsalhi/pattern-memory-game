/** Prefix a /public path with the deployment base path (GitHub Pages sub-path). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Media prefix; NEXT_PUBLIC_ASSET_BASE=. gives relative paths for hosts that serve the site from an unknown sub-path. */
const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE ?? basePath;

export const asset = (p: string) => `${assetBase}/${p.replace(/^\//, '')}`;

/** Locale-aware internal href ("/en/" or "/"). */
export const href = (p: string) => `${basePath}${p}`;
