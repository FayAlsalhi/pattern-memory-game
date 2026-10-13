#!/usr/bin/env node
/**
 * Generates clearly-labelled PLACEHOLDER videos, posters and stills under
 * public/media so every player on the site is a real, working <video>.
 *
 * Replace them with authorised campaign media using the same file names
 * (or point src/content/media.ts at the new files) — see MEDIA.md.
 *
 * Requirements: ffmpeg on PATH and a Chromium binary
 * (CHROMIUM_PATH=/path/to/chrome, defaults to /opt/pw-browsers/chromium).
 *
 *   npm run media:placeholders            # everything
 *   npm run media:placeholders -- ugc-skincare film-brand
 */
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = (...p) => join(root, 'public', 'media', ...p);
const FPS = 30;

const V = { w: 540, h: 960, vertical: true, duration: 6 };
const L = { w: 1280, h: 720, vertical: false, duration: 8 };

/** @type {Array<Record<string, any>>} */
const scenes = [
  // ---- vertical 9:16 ----
  { id: 'ugc-skincare', ...V, motif: 'bottle', palette: ['#ffc7b5', '#c9646f', '#3a1420'], accent: ['#f6b39a', '#b0545e'], title: 'UGC', subtitle: 'مراجعة منتج', titleY: 0.16, cy: 0.56 },
  { id: 'ugc-coffee', ...V, motif: 'cup', palette: ['#e9b779', '#7a4a26', '#1e120b'], accent: ['#5b3416', '#3b2414'], title: 'UGC', subtitle: 'تجربة يومية', titleY: 0.16, cy: 0.58 },
  { id: 'ugc-tea', ...V, motif: 'cup', palette: ['#9be3cf', '#1f7a6a', '#06221d'], accent: ['#b4602d', '#2b5d55'], title: 'لحظة', subtitle: 'محتوى UGC', titleY: 0.16, cy: 0.58 },
  { id: 'influencer-unboxing', ...V, motif: 'box', palette: ['#c4b5fd', '#5b3fd1', '#120a33'], accent: ['#a78bfa', '#4c1d95'], title: 'فتح الصندوق', subtitle: 'حملة مؤثرين', titleY: 0.16, cy: 0.6, titleSize: 76 },
  { id: 'influencer-lifestyle', ...V, motif: 'portrait', palette: ['#93c5fd', '#2563eb', '#0b1430'], accent: ['#bfdbfe', '#0f1a3a'], title: '', titleY: 0.2, cy: 0.5 },
  { id: 'influencer-day', ...V, motif: 'portrait', palette: ['#fde68a', '#d97706', '#2a1503'], accent: ['#fff1c1', '#2a1a08'], captions: ['يوم مع المؤثر', 'المنتج في سياقه', 'رابط الحملة'], title: '', titleY: 0.2, cy: 0.5 },
  { id: 'celebrity-launch', ...V, motif: 'spotlight', palette: ['#5c4bd6', '#1c145a', '#05030f'], title: 'ظهور خاص', subtitle: 'تعاون مع المشاهير', titleY: 0.2, cy: 0.45, titleSize: 80 },
  { id: 'product-fragrance', ...V, motif: 'bottle', palette: ['#e8c37a', '#6b4a12', '#100a02'], accent: ['#f1d18a', '#7a5414'], title: 'إطلاق', subtitle: 'إعلان منتج', titleY: 0.15, cy: 0.57 },
  { id: 'social-food', ...V, motif: 'plate', palette: ['#ffb38a', '#b44a1f', '#2a0c03'], ingredients: ['#e94f37', '#f6c445', '#6bbf59', '#7a3b1f', '#ffffff'], title: 'ريلز', subtitle: 'محتوى سوشيال', titleY: 0.13, cy: 0.58 },
  { id: 'brand-opening', ...V, motif: 'rings', palette: ['#a5b4fc', '#3730a3', '#07061c'], confetti: ['#93c5fd', '#ffffff', '#2563eb', '#fde68a'], title: 'افتتاح', subtitle: 'حملة علامة تجارية', titleY: 0.48, titleSize: 110 },
  // ---- landscape 16:9 ----
  { id: 'film-brand', ...L, motif: 'fabric', palette: ['#8b9cff', '#28307a', '#070a1e'], title: 'قصة علامتك', subtitle: 'فيلم حملة · نموذج', titleY: 0.48, titleSize: 120, titleIn: 0.1, titleOut: 0.9 },
  { id: 'film-launch', ...L, motifs: ['spotlight', 'bottle'], palette: ['#f0c27a', '#5a3a0e', '#0d0802'], accent: ['#f1d18a', '#7a5414'], title: 'إطلاق منتج', subtitle: 'إعلان تجاري · نموذج', titleY: 0.16, cy: 0.58, titleSize: 70 },
  // decorative ambient loop behind the closing call to action — no text, no campaign
  { id: 'ambient-signal', ...L, duration: 10, motifs: ['fabric', 'signal'], palette: ['#4f46e5', '#1e1b6b', '#04061a'], cy: 0.92, label: false },
  { id: 'film-event', ...L, motif: 'rings', palette: ['#c4b5fd', '#4c1d95', '#0b0420'], confetti: ['#c4b5fd', '#ffffff', '#f0abfc', '#fde68a'], title: 'تغطية فعالية', subtitle: 'افتتاحات وإطلاقات · نموذج', titleY: 0.48, titleSize: 110 },
];

/** Stills used as photography placeholders. */
const stills = [
  { id: 'photo-product', w: 1080, h: 1350, vertical: false, duration: 6, at: 1.5, motif: 'bottle', palette: ['#f3e0cf', '#b98f72', '#2b1a10'], accent: ['#f6efe6', '#a88a6e'], titleY: 0.1 },
  { id: 'photo-coffee', w: 1350, h: 1080, vertical: false, duration: 6, at: 2, motif: 'cup', palette: ['#e2b48a', '#6b3d1d', '#1a0e06'], accent: ['#4a2a12', '#3b2414'], titleY: 0.1 },
  { id: 'photo-portrait', w: 1080, h: 1350, vertical: false, duration: 6, at: 0.2, motif: 'portrait', captions: [], palette: ['#c7d2fe', '#4338ca', '#0b0a2a'], accent: ['#e0e7ff', '#14123a'], titleY: 0.1, cy: 0.55 },
  { id: 'photo-event', w: 1350, h: 1080, vertical: false, duration: 6, at: 3, motif: 'rings', palette: ['#fbcfe8', '#9d174d', '#1f0410'], confetti: ['#fbcfe8', '#ffffff', '#fde68a'], titleY: 0.1 },
  { id: 'photo-food', w: 1080, h: 1080, vertical: false, duration: 6, at: 1, motif: 'plate', ingredients: ['#e94f37', '#f6c445', '#6bbf59', '#7a3b1f', '#ffffff'], palette: ['#ffd9b8', '#c2652f', '#2a0c03'], titleY: 0.1 },
];

function run(cmd, args, input) {
  return new Promise((ok, fail) => {
    const p = spawn(cmd, args, { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
    p.on('error', fail);
    p.on('close', (code) => (code === 0 ? ok() : fail(new Error(`${cmd} exited ${code}`))));
    if (input) input(p.stdin);
  });
}

async function main() {
  const only = process.argv.slice(2);
  ['video', 'posters', 'photos'].forEach((d) => mkdirSync(out(d), { recursive: true }));
  const exe = process.env.CHROMIUM_PATH || findChromium();
  const browser = await chromium.launch({ executablePath: exe });
  const page = await browser.newPage();
  await page.goto(pathToFileURL(join(root, 'scripts', 'placeholder-scenes.html')).href);
  await page.evaluate(() => window.ready);
  const jpeg = async (q) => Buffer.from((await page.evaluate((q) => window.frame(q), q)).split(',')[1], 'base64');

  for (const s of scenes) {
    if (only.length && !only.includes(s.id)) continue;
    await page.evaluate((s) => window.setup(s), s);
    const frames = s.duration * FPS;
    // one pass, two outputs: VP9/WebM + H.264/MP4 (universal fallback).
    // VP9 uses constrained quality with a bitrate cap — film grain is costly at pure CRF.
    await run('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', s.vertical ? '380k' : '1100k', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', out('video', `${s.id}.webm`),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', s.vertical ? '27' : '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out('video', `${s.id}.mp4`)],
      async (stdin) => {
        for (let f = 0; f < frames; f++) {
          await page.evaluate(([t, f]) => window.draw(t, f), [f / FPS, f]);
          if (!stdin.write(await jpeg(0.94))) await new Promise((r) => stdin.once('drain', r));
        }
        stdin.end();
      });
    // poster = frame 1s in, matches what the clip shows while loading
    await page.evaluate(() => window.draw(1, 0));
    await run('ffmpeg', ['-y', '-v', 'error', '-i', '-', '-q:v', '5', out('posters', `${s.id}.jpg`)], async (stdin) => stdin.end(await jpeg(0.95)));
    console.log('✓ video', s.id);
  }

  for (const s of stills) {
    if (only.length && !only.includes(s.id)) continue;
    await page.evaluate((s) => window.setup(s), s);
    await page.evaluate((t) => window.draw(t, 0), s.at);
    await run('ffmpeg', ['-y', '-v', 'error', '-i', '-', '-q:v', '4', out('photos', `${s.id}.jpg`)], async (stdin) => stdin.end(await jpeg(0.95)));
    console.log('✓ still', s.id);
  }
  await browser.close();
}

function findChromium() {
  const base = '/opt/pw-browsers';
  if (existsSync(base)) {
    for (const d of readdirSync(base).filter((d) => d.startsWith('chromium-'))) {
      const p = join(base, d, 'chrome-linux', 'chrome');
      if (existsSync(p)) return p;
    }
  }
  throw new Error('Set CHROMIUM_PATH to a Chromium/Chrome executable');
}

main().catch((e) => { console.error(e); process.exit(1); });
