/** Prefix a /public path with the deployment base path (GitHub Pages sub-path). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const asset = (p: string) => `${basePath}/${p.replace(/^\//, '')}`;

/** Locale-aware internal href ("/en/" or "/"). */
export const href = (p: string) => `${basePath}${p}`;
