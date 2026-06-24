#!/usr/bin/env bash
#
# Regenerate the printable menu PDF FROM the live HTML menu page, so the PDF's
# font (Cloister Black) and layout always match the website exactly. Run this
# after editing the menu (src/content/menu-body.html):
#
#   npm run menu:pdf
#
# Output: public/assets/Brandts-of-Palatine-Menu.pdf  (clean 2-page legal PDF)
#
# Requires Google Chrome. Override the path with CHROME=... if needed.
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-4533}"
OUT="$DIR/public/assets/Brandts-of-Palatine-Menu.pdf"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

# Build first so the HTML reflects the latest menu content.
node "$DIR/scripts/build.js" >/dev/null

# Serve locally (web fonts load reliably over http, unlike file://).
node "$DIR/scripts/serve.js" "$PORT" >/dev/null 2>&1 &
SRV=$!
trap 'kill "$SRV" 2>/dev/null' EXIT
sleep 1

# Print the menu page to PDF. @page in menu.css sets legal size + margins;
# the print stylesheet hides the site header/nav/footer/toolbar.
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
  --print-to-pdf="$OUT" \
  "http://localhost:$PORT/menu.html"

echo "Wrote $OUT"
