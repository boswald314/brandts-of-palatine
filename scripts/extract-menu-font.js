#!/usr/bin/env node
/*
 * OPTIONAL: extract the embedded blackletter logo font from a copy of the
 * original menu.html so the menu masthead uses the exact "Brandt's" face
 * instead of the serif fallback.
 *
 * Usage:
 *   1) Copy your menu.html into the project, e.g.:
 *        cp "/path/to/menu.html" incoming/menu.html
 *   2) node scripts/extract-menu-font.js [optional/path/to/menu.html]
 *   3) npm run build
 *
 * It writes public/assets/fonts/brandts-blackletter.woff and
 * public/css/menu-font.css. menu.js auto-detects that CSS and links it.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = process.argv[2] || path.join(root, "incoming", "menu.html");

if (!fs.existsSync(src)) {
  console.log(
    `No source found at ${src}\n` +
      `Copy your original menu.html there (or pass a path), then re-run.\n` +
      `Until then the menu logo uses a serif fallback — that's fine.`
  );
  process.exit(0);
}

const html = fs.readFileSync(src, "utf8");
const m = html.match(/data:font\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/=]+)/i);
if (!m) {
  console.error("No embedded base64 font found in", src);
  process.exit(1);
}

const fontsDir = path.join(root, "public", "assets", "fonts");
fs.mkdirSync(fontsDir, { recursive: true });
const buf = Buffer.from(m[1], "base64");
fs.writeFileSync(path.join(fontsDir, "brandts-blackletter.woff"), buf);

fs.writeFileSync(
  path.join(root, "public", "css", "menu-font.css"),
  `/* Brandt's blackletter logo face, extracted from the original menu. */
@font-face {
  font-family: 'BrandtsBlackletter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(../assets/fonts/brandts-blackletter.woff) format('woff');
}
`
);

console.log(
  `Wrote brandts-blackletter.woff (${buf.length} bytes) + public/css/menu-font.css.\n` +
    `Run "npm run build" to apply.`
);
