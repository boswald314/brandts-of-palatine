# Brandt's of Palatine — static site

A clean, static rebuild of [brandtsofpalatine.com](https://www.brandtsofpalatine.com),
designed to be hosted anywhere (GitHub Pages, Netlify, Cloudflare Pages, plain
nginx) — no Squarespace required.

It's a tiny Node-based static generator: page content + a shared layout get
compiled into plain `.html` files in `public/`. The output is 100% static, so
once built it needs no server-side code to host.

## Quick start

```bash
npm install          # only needed for the scraper (cheerio); build needs nothing
npm run build        # regenerate public/*.html from src/
npm run serve        # serve public/ at http://localhost:4321
```

Then open <http://localhost:4321>.

> Building requires **no dependencies** — `node scripts/build.js` works on a bare
> checkout. `npm install` only pulls `cheerio`, used by the one-off scraper.

## Project layout

```
src/
  data/site.js          ← SINGLE SOURCE OF TRUTH: business info, hours, social, NAV
  templates/
    layout.js           ← page shell (head, header/nav, footer)
    components.js        ← helpers (hero, sections, video embeds, contact form…)
  pages/                 ← one file per page; each returns its body HTML
    index.js menu.js party-menu.js hours.js location.js
    contact.js history.js dining.js press.js
scripts/
  build.js              ← renders every page in src/pages → public/*.html
  serve.js              ← tiny local static server
  scrape.js             ← one-off: pulled content+images from the live site
public/                  ← BUILD OUTPUT — this is what you host
  *.html  css/  js/  assets/images/
raw/                     ← archived copies of the original Squarespace HTML (reference)
```

## Common edits

**Reorganize the menu bar** → edit the `nav` array in
[`src/data/site.js`](src/data/site.js). Items with `children` become dropdowns.
Re-run `npm run build`.

**Change hours / phone / address** → edit the matching fields in
`src/data/site.js`. They propagate to every page (header, footer, schema.org).

**Edit a page's words/images** → edit the matching file in `src/pages/`, then
`npm run build`. Images live in `public/assets/images/`.

**Restyle** → `public/css/style.css`. The colors/fonts are CSS variables at the
top (`:root`).

## Contact form

The form on `/contact` works two ways (set in `src/data/site.js`):

- **`formspreeId` empty (default):** the form falls back to opening the visitor's
  email app pre-filled to `brandtsofpalatine@gmail.com`. No signup needed.
- **`formspreeId` set:** sign up free at <https://formspree.io>, create a form,
  paste its ID (e.g. `"xyzabcde"`) into `formspreeId`, rebuild. Submissions then
  get emailed to you and the visitor stays on the page.

## Deploy to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. To use it:

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and publishes `public/` automatically.

*(No-CI alternative: set the build to output to `docs/`, commit it, and point
Pages at `main` / `/docs`.)*

To use a custom domain, add a `CNAME` file to `public/` containing your domain.

## Notes on fidelity

- **Fonts:** the original uses Oswald (free) + Proxima Nova (paid Adobe font).
  Oswald is loaded from Google Fonts; Proxima Nova is approximated with
  **Source Sans 3** (free, very close). Swap in the real font later if you license it.
- **Press page:** the three old media pages (ABC News, Chicago's Best Burgers,
  Off 53) are consolidated into one **Press** page. The Daily Herald / Patch
  newspaper articles are **linked with attribution** rather than copied, to keep
  the site clear of third-party copyrighted text.
- **Menu:** rendered from the same scanned menu images the live site uses
  (`2025-September-TAKE-OUT-MENU` pages 1 & 2). Replace those JPGs to update the menu,
  or ask to convert the menu to real editable HTML text.
```
