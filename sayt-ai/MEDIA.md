# Media replacement list

Every video and photo currently on the site is a **generated placeholder**.
Each one carries a "نموذج مؤقت · PLACEHOLDER" label inside the file, plus a
badge in the UI. They exist so that every player, phone mockup, filter and
viewer works end to end. **No campaign, client, creator or celebrity is
implied by any of them.**

Replace them with **authorised** Sayt.Ai campaign media only. Never add a
`brand` or `creator` credit, a celebrity name or a result unless the
collaboration is real and you have permission to show it.

## How to replace an item

1. Export the asset (specs below) and drop it in `public/media/…`.
   Keep the same file name to swap it in place, or use a new name.
2. Edit the entry in `src/content/media.ts`:
   - `src` → MP4 path, `webm` → WebM path (optional; remove it if you have no WebM), `poster` → poster path
   - `title`, `alt`, and optionally `caption`, in Arabic (`ar`) and English (`en`)
   - `brand` / `creator`, only for real, authorised collaborations
   - `placeholder: false` (or delete the line). This removes the UI badge.
3. Run `npm run build`.

To add a new item, copy an entry, give it a unique `id`, and choose its
`placements`: `hero`, `featured`, `creators`, `gallery`, `production`, `services`.
`order` controls the sort order, and `category` drives the gallery filters.

## Delivery specs

| Use | Ratio | Size | Codec / format | Length | Notes |
|---|---|---|---|---|---|
| Reels, UGC, hero phones | 9:16 | 720×1280 (540×960 min) | H.264 MP4 + VP9 WebM | 6–20 s loop | no burnt-in captions near the top 8% (the phone's dynamic island) |
| Films / commercials | 16:9 | 1920×1080 (1280×720 min) | H.264 MP4 + VP9 WebM | 8–30 s preview | a short cut-down for previews; the full film can be a separate file |
| Photography | 4:5, 5:4, 1:1 | 1600 px long edge | JPEG q80 / WebP | — | |
| Posters | same as video | same as video | JPEG q75 | — | a representative frame, shown before the video loads |

Suggested encodes:

```bash
ffmpeg -i in.mov -an -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -i in.mov -an -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 out.webm
ffmpeg -ss 1 -i out.mp4 -frames:v 1 -q:v 5 poster.jpg
```

Preview videos are always muted. Sound only plays in the full-screen viewer,
and only when the visitor turns it on, so a separate audio mix is optional.

## Current placeholders → what to supply

| id | Section(s) | Needed |
|---|---|---|
| `ugc-skincare` | Hero, UGC gallery | 9:16 UGC ad (product review style) |
| `influencer-lifestyle` | Hero, Creators, gallery | 9:16 influencer campaign clip |
| `celebrity-launch` | Hero, Creators, gallery | 9:16 **authorised** celebrity collaboration |
| `product-fragrance` | Hero, gallery, Services 02 | 9:16 product ad |
| `ugc-coffee` | Hero, gallery | 9:16 UGC ad |
| `influencer-unboxing` | Creators, gallery, Services 01 | 9:16 influencer unboxing |
| `influencer-day` | Creators, gallery | 9:16 influencer clip |
| `social-food` | Gallery, Production | 9:16 social reel |
| `ugc-tea` | Gallery, Production | 9:16 UGC ad |
| `brand-opening` | Gallery, Services 03 | 9:16 opening / brand activation reel |
| `film-brand` | Featured (lead film), contact background | 16:9 brand film |
| `film-launch` | Featured, Production, gallery | 16:9 product launch commercial |
| `film-event` | Featured, Production, Services 04 | 16:9 event or opening coverage |
| `photo-product` | Featured, Production, gallery | 4:5 product photography |
| `photo-coffee` | Production, gallery | 5:4 campaign photography |
| `photo-portrait` | Featured, Creators | 4:5 **authorised** creator portrait |
| `photo-event` | Production, gallery | 5:4 event photography |
| `photo-food` | Production, gallery | 1:1 social photography |

To regenerate the placeholders (for example after adding a new id to
`scripts/generate-placeholders.mjs`), run `npm run media:placeholders`.
This needs ffmpeg and a Chromium binary (`CHROMIUM_PATH`).
