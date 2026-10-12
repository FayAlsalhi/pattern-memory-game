# Sayt.Ai — website v2

An Arabic-first, video-driven website for **Sayt.Ai (صيت AI)**, a creative
agency for influencer, celebrity, UGC and campaign marketing.

The guiding rule is *show, don't tell*. The homepage is one continuous,
seven-scene visual story:

| # | Scene | What it does |
|---|---|---|
| 01 | Hero (`#top`) | Five floating smartphones play vertical ads. They have depth, 3D tilt, pointer parallax and a scroll-driven exit. Tap any phone to open the full viewer. One CTA. |
| 02 | Featured campaigns (`#work`) | A keyword ticker, then a cinema-scale film that opens up on scroll, then an editorial spread of films and stills. |
| 03 | Influencers & celebrities (`#creators`) | Portrait videos in phone mockups with parallax offsets, plus the 1050+ influencers count. |
| 04 | UGC gallery (`#ugc`) | A masonry grid with category filters and animated transitions. Previews autoplay muted while in view, hovered tiles play first, and tap/click opens the viewer. |
| 05 | Creative production | A strip of films, reels and photos. On desktop it is pinned and pans horizontally as you scroll; on touch it is a swipe rail. |
| 06 | Services (`#services`, `#method`, `#clients`) | The original services with media examples, the "audience + influencer + goal" equation, the four-step method, the numbers and the client logos. |
| 07 | Start your campaign (`#contact`) | Footage behind a large typographic CTA with the original rotating phrases, plus brand and creator entry points. |

## Stack

- **Next.js 15** (App Router, static export) with **React 19** and **TypeScript**
- **Tailwind CSS v4**, with design tokens in `src/app/globals.css`
- **Motion** (`motion/react`) for entrance, scroll-linked, layout and parallax animation
- Thmanyah typefaces, the same family the original site uses (`src/fonts`)

## Run

```bash
npm install
npm run dev          # http://localhost:3000 (Arabic) and /en/ (English)
npm run build        # static site in ./out
npm run typecheck
```

### Deploy (GitHub Pages or any static host)

`npm run build` writes a fully static site to `out/`. If it is served from a
sub-path (for example `https://saytai.github.io/Sayt.Ai/`), build with:

```bash
NEXT_PUBLIC_BASE_PATH=/Sayt.Ai NEXT_PUBLIC_SITE_URL=https://saytai.github.io npm run build
```

## Project structure

```
src/
  app/(ar)/…           Arabic root layout (lang="ar" dir="rtl"), served at /
  app/(en)/en/…        English root layout (lang="en" dir="ltr"), served at /en/
  app/globals.css      tokens, fabric material, device and control styles
  content/
    site.ts            verified business content: links, stats, clients, services, method
    media.ts           campaign media library and gallery categories
    copy.ts            interface copy (ar / en)
    types.ts           content types
  components/
    FabricBackground   fixed textile surface (weave, folds, grain, moving key light)
    Header             nav, language switch, CTA, mobile menu
    media/             PhoneFrame, SmartVideo, Media, Viewer (full-screen dialog)
    sections/          Hero, Featured, Creators, Gallery, Production, Services, Contact
  lib/                 asset paths, locale context, playback budget, media queries
scripts/               placeholder media generator
```

## Content

- **Business content** (`src/content/site.ts`) is carried over verbatim from
  the original site: the tagline, services, method, the trust points, the
  numbers from the trial period (+1050 influencers, +35 projects), the nine
  client logos and the CTA destination (`linkjar.co/ATHAR.sa`). The English
  copy comes from the original `en.html`.
- **Media** (`src/content/media.ts`): each entry has a title, category, video
  or image source, WebM and MP4 renditions, poster, aspect ratio, optional
  brand or creator credit, order, featured flag, alt text, caption and
  placements.
- **All current media are labelled placeholders.** See [`MEDIA.md`](./MEDIA.md)
  for the replacement list and delivery specs.

## Media behaviour, performance and accessibility

- Previews are muted, looping and `playsInline`. They load only near the
  viewport (`preload="none"` until then) and play only while visible.
- A global playback budget (`src/lib/playback.ts`) allows at most 3
  simultaneous previews on phones and 7 on desktop, ranked by visibility and
  hover. Everything pauses when the tab is hidden or the viewer is open.
- WebM (VP9) is offered first and MP4 (H.264) second, so every modern browser, including Chromium builds without H.264, gets a playable file. Posters show while
  loading, and a fallback message appears if a file fails.
- The full-screen viewer uses a native `<dialog>`, so focus is trapped and Esc
  closes it. It has play/pause, sound, a scrubber, fullscreen and prev/next.
  Arrow keys follow reading direction, and `m` toggles sound.
- `prefers-reduced-motion`: autoplay, parallax, floating, the pinned pan and
  the marquees are all disabled, posters are shown, and the viewer still
  works on demand.
- All media sit in fixed-ratio boxes (no layout shift). Fonts are self-hosted
  with `font-display: swap`. Every control is a real button or link with a
  label, there is a skip link, and focus rings are visible.
