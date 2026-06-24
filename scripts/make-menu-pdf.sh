#!/usr/bin/env bash
#
# Regenerate the downloadable menu PDF from the self-contained carryout menu
# (src/content/menu-carryout.html). That file carries its own styles + embedded
# Cloister Black font and the phone number in the masthead, so the PDF matches it
# exactly — clean 2-page legal document.
#
#   npm run menu:pdf
#
# Output: public/assets/Brandts-of-Palatine-Menu.pdf
# Requires Google Chrome (override the path with CHROME=... if needed).
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
SRC="$DIR/src/content/menu-carryout.html"
OUT="$DIR/public/assets/Brandts-of-Palatine-Menu.pdf"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME — set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi
if [ ! -f "$SRC" ]; then
  echo "Missing menu source: $SRC" >&2
  exit 1
fi

# The carryout HTML is fully self-contained (inline CSS + embedded base64 font),
# so we render it directly from file:// — no local server needed. @page in its
# stylesheet sets legal page size + margins and paginates it to two sheets.
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
  --print-to-pdf="$OUT" "file://$SRC"

echo "Wrote $OUT"
