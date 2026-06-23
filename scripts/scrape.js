#!/usr/bin/env node
/*
 * Scrapes brandtsofpalatine.com (the live Squarespace site) into structured
 * content JSON + locally-downloaded images, so we can rebuild it as a clean
 * static site. This only reads the owner's own public site content.
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ORIGIN = 'https://www.brandtsofpalatine.com';
const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'raw');
const CONTENT = path.join(ROOT, 'src', 'content');
const IMG_DIR = path.join(ROOT, 'public', 'assets', 'images');

for (const d of [RAW, CONTENT, IMG_DIR]) fs.mkdirSync(d, { recursive: true });

// slug -> friendly key. Order roughly matches desired nav order.
const PAGES = [
  ['welcome', 'home'],
  ['menu', 'menu'],
  ['pub-room-party-menu', 'party-menu'],
  ['hours', 'hours'],
  ['location-information', 'location'],
  ['contact', 'contact'],
  ['our-history', 'history'],
  ['indoor-and-outdoor-dining-available', 'dining'],
  ['abc-news-review', 'press-abc'],
  ['chicagos-best-burgers', 'press-burgers'],
  ['off-53-video-featuring-brandts', 'press-off53'],
  ['blog/2013/4/12/read-the-articles-of-brandts-of-palatine-reopening', 'press-reopening'],
  ['blog/2013/6/5/daily-herald-menu-renovations-give-palatines-brandts-a-new-lease-on-life', 'press-daily-herald'],
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return await res.text();
}

const imageManifest = new Map(); // remoteUrl -> localFilename

function normalizeImgUrl(u) {
  if (!u) return null;
  u = u.trim();
  if (u.startsWith('//')) u = 'https:' + u;
  if (u.startsWith('/')) u = ORIGIN + u;
  if (!/^https?:/i.test(u)) return null;
  // strip squarespace format params to grab a large version
  return u;
}

function localNameFor(remoteUrl) {
  if (imageManifest.has(remoteUrl)) return imageManifest.get(remoteUrl);
  // build a readable, unique filename from the squarespace path
  let base = remoteUrl.split('?')[0].split('/').pop() || 'image';
  base = decodeURIComponent(base).replace(/[^a-zA-Z0-9._-]/g, '-');
  if (!/\.(jpe?g|png|gif|webp|svg|ico)$/i.test(base)) base += '.jpg';
  let name = base;
  let i = 1;
  const taken = new Set(imageManifest.values());
  while (taken.has(name)) {
    const dot = base.lastIndexOf('.');
    name = base.slice(0, dot) + '-' + i + base.slice(dot);
    i++;
  }
  imageManifest.set(remoteUrl, name);
  return name;
}

// Extract a clean structured representation of the page's main content.
function extractContent($, key) {
  // Squarespace main content lives in .sqs-layout blocks inside #content / main
  const main = $('#content, [role="main"], .sqs-layout').first().length
    ? $('#content, [role="main"], .sqs-layout').first()
    : $('body');

  const title = ($('meta[property="og:title"]').attr('content') || $('title').text() || '').trim();
  const metaDesc = ($('meta[name="description"]').attr('content') || '').trim();

  const blocks = [];
  const seenText = new Set();

  // Walk content blocks in document order
  $('.sqs-block', main).each((_, el) => {
    const $el = $(el);
    const type = ($el.attr('class') || '').match(/sqs-block-(\w+)/);
    const kind = type ? type[1] : 'unknown';

    if (kind === 'image' || $el.find('img').length) {
      $el.find('img').each((__, img) => {
        const $img = $(img);
        const src = normalizeImgUrl(
          $img.attr('data-src') || $img.attr('src') ||
          ($img.attr('srcset') || '').split(',').pop()?.trim().split(' ')[0]
        );
        if (!src) return;
        const alt = ($img.attr('alt') || '').trim();
        blocks.push({ type: 'image', src, alt, _local: localNameFor(src) });
      });
    }

    if (kind === 'html' || kind === 'markdown') {
      const $c = $el.find('.sqs-block-content').first();
      // pull headings, paragraphs, lists as html-ish structured text
      $c.children().each((__, child) => {
        const $child = $(child);
        const tag = child.tagName ? child.tagName.toLowerCase() : '';
        const text = $child.text().replace(/\s+/g, ' ').trim();
        if (!text) {
          // could be an image inside html block
          $child.find('img').each((___, img) => {
            const src = normalizeImgUrl($(img).attr('data-src') || $(img).attr('src'));
            if (src) blocks.push({ type: 'image', src, alt: ($(img).attr('alt')||'').trim(), _local: localNameFor(src) });
          });
          return;
        }
        const dedupeKey = tag + '|' + text;
        if (seenText.has(dedupeKey)) return;
        seenText.add(dedupeKey);
        if (/^h[1-6]$/.test(tag)) {
          blocks.push({ type: 'heading', level: +tag[1], text });
        } else if (tag === 'ul' || tag === 'ol') {
          const items = [];
          $child.find('li').each((___, li) => {
            const t = $(li).text().replace(/\s+/g, ' ').trim();
            if (t) items.push(t);
          });
          blocks.push({ type: 'list', ordered: tag === 'ol', items });
        } else {
          // keep inner HTML for links/bold within paragraphs
          const html = $child.html();
          blocks.push({ type: 'text', tag, text, html });
        }
      });
    }

    if (kind === 'video' || kind === 'embed' || $el.find('iframe').length) {
      $el.find('iframe').each((__, ifr) => {
        const src = $(ifr).attr('src') || $(ifr).attr('data-src');
        if (src) blocks.push({ type: 'embed', src: normalizeImgUrl(src) });
      });
      const oembed = $el.find('.sqs-block-video');
      const videoUrl = oembed.attr('data-config-url');
      if (videoUrl) blocks.push({ type: 'embed', src: videoUrl });
    }
  });

  return { key, title, metaDesc, blocks };
}

async function downloadImage(remoteUrl, filename) {
  const dest = path.join(IMG_DIR, filename);
  if (fs.existsSync(dest)) return;
  try {
    const res = await fetch(remoteUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) { console.warn('  ! img', res.status, remoteUrl); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    process.stdout.write(`  + ${filename} (${(buf.length/1024).toFixed(0)}kb)\n`);
  } catch (e) {
    console.warn('  ! img err', remoteUrl, e.message);
  }
}

(async () => {
  const index = [];
  for (const [slug, key] of PAGES) {
    const url = `${ORIGIN}/${slug}`;
    process.stdout.write(`\n== ${key}  (${slug}) ==\n`);
    let html;
    try { html = await fetchText(url); }
    catch (e) { console.warn('  FAILED:', e.message); continue; }
    fs.writeFileSync(path.join(RAW, key + '.html'), html);
    const $ = cheerio.load(html);
    const content = extractContent($, key);
    content.slug = slug;
    fs.writeFileSync(path.join(CONTENT, key + '.json'), JSON.stringify(content, null, 2));
    const imgCount = content.blocks.filter(b => b.type === 'image').length;
    const textCount = content.blocks.filter(b => b.type !== 'image').length;
    console.log(`  parsed: ${content.blocks.length} blocks (${imgCount} images, ${textCount} text/other)`);
    index.push({ key, slug, title: content.title, blocks: content.blocks.length });
  }

  // Logo / site header image from homepage
  const homeRaw = fs.readFileSync(path.join(RAW, 'home.html'), 'utf8');
  const $h = cheerio.load(homeRaw);
  const logo = normalizeImgUrl(
    $h('img.logo-image, .logo-image img, header img').first().attr('data-src') ||
    $h('img.logo-image, .logo-image img, header img').first().attr('src')
  );
  if (logo) { localNameFor(logo); index.push({ logo }); }

  // Download every collected image
  console.log(`\n== downloading ${imageManifest.size} images ==`);
  for (const [remote, name] of imageManifest) {
    await downloadImage(remote, name);
  }

  fs.writeFileSync(path.join(CONTENT, '_index.json'), JSON.stringify(index, null, 2));
  fs.writeFileSync(path.join(CONTENT, '_images.json'),
    JSON.stringify(Object.fromEntries(imageManifest), null, 2));
  console.log('\nDONE. content -> src/content/, images -> public/assets/images/');
})();
