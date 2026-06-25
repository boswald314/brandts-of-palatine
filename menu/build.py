#!/usr/bin/env python3
"""
Brandt's of Palatine — menu builder.

Reads menu.json (the single source of truth) and renders a static, dependency-free
HTML file that is BOTH responsive on the web AND print-ready for PDF export.

Usage:
    python3 build.py                 # -> menu.html
    python3 build.py --pdf           # also tries to render menu.pdf via WeasyPrint
    python3 build.py --page letter   # print page size: letter | legal (default: legal)

To change prices: edit menu.json, rerun this script. Layout stays identical.
"""

import argparse
import base64
import html as html_lib
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent

# --- Brand display font -----------------------------------------------------
# Display face: "Cloister Black" (Dieter Steffmann's digitization of the ATF
# blackletter originally cut by Morris Fuller Benton, 1904) — an authentic
# Textura, the same design lineage as "Old English Text MT", free for
# commercial use and embeddable. Its capital "B" matches the Brandt's logo.
# To use a font you license instead (e.g. Old English Text MT itself), drop its
# .woff2/.woff/.otf/.ttf in ./fonts and point FONT_FILE at it, then rerun.
FONT_FILE = HERE / "fonts" / "CloisterBlack.woff"
FONT_FAMILY = "BrandtsBlackletter"

_FONT_FORMATS = {"woff2": ("font/woff2", "woff2"), "woff": ("font/woff", "woff"),
                 "ttf": ("font/ttf", "truetype"), "otf": ("font/otf", "opentype")}


def font_face_css() -> str:
    """Return an @font-face rule with the display font embedded as base64,
    so the single HTML file renders identically in any browser and in PDF
    with no external font dependency."""
    mime, fmt = _FONT_FORMATS.get(FONT_FILE.suffix.lower().lstrip("."),
                                  ("font/woff2", "woff2"))
    data = base64.b64encode(FONT_FILE.read_bytes()).decode("ascii")
    return (
        f"@font-face{{font-family:'{FONT_FAMILY}';font-style:normal;"
        f"font-weight:400;font-display:swap;"
        f"src:url(data:{mime};base64,{data}) format('{fmt}');}}"
    )


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def esc(text: str) -> str:
    """HTML-escape (text context), normalize apostrophes to the typographic
    form (U+2019) so they render in the blackletter face and read better,
    then preserve runs of 2+ spaces as non-breaking gaps."""
    out = html_lib.escape(str(text), quote=False)
    out = out.replace("'", "\u2019")
    out = re.sub(r" {2,}", lambda m: "&nbsp;" * len(m.group(0)), out)
    return out


def fmt_price(price: str) -> str:
    """Add a $ in front of every NN.NN amount; leave labels/qty untouched."""
    if price is None:
        return ""
    s = re.sub(r"(\d+\.\d{2})", r"$\1", str(price))
    return esc(s)


def hand(flag) -> str:
    return '<span class="hand">&#9758;</span> ' if flag else ""


def item_row(it: dict) -> str:
    name = hand(it.get("hand")) + esc(it["name"])
    price = it.get("price")
    if price:
        line = (
            '<div class="row">'
            f'<span class="iname">{name}</span>'
            '<span class="leader"></span>'
            f'<span class="iprice">{fmt_price(price)}</span>'
            "</div>"
        )
    else:
        line = f'<div class="row no-price"><span class="iname">{name}</span></div>'
    desc = it.get("desc")
    if desc:
        line += f'<div class="idesc">{esc(desc)}</div>'
    return f'<div class="item">{line}</div>'


def items_block(items: list) -> str:
    return "\n".join(item_row(it) for it in items)


# ---------------------------------------------------------------------------
# section layouts
# ---------------------------------------------------------------------------

def render_header(sec: dict) -> str:
    eyebrow = (
        f'<span class="eyebrow">{esc(sec["eyebrow"])}</span>' if sec.get("eyebrow") else ""
    )
    title = hand(sec.get("hand")) + esc(sec["title"])
    return f'<h2 class="sec-title">{eyebrow}{title}</h2>'


def render_intro(sec: dict) -> str:
    out = ""
    if sec.get("intro_left") or sec.get("intro_right"):
        out += (
            '<div class="intro-split">'
            f'<div>{esc(sec.get("intro_left",""))}</div>'
            f'<div>{esc(sec.get("intro_right",""))}</div>'
            "</div>"
        )
    elif sec.get("intro"):
        out += f'<p class="intro">{esc(sec["intro"])}</p>'
    return out


def render_split(sec: dict, n: int) -> str:
    cls = "cols-3" if n == 3 else "cols-2"
    cols = "".join(f'<div class="col">{items_block(c)}</div>' for c in sec["columns"])
    inner = render_intro(sec) + f'<div class="{cls}">{cols}</div>'
    if sec.get("footnote"):
        inner += f'<p class="footnote">{esc(sec["footnote"])}</p>'
    return inner


def render_list(sec: dict) -> str:
    inner = render_intro(sec) + f'<div class="list">{items_block(sec["items"])}</div>'
    if sec.get("footnote"):
        inner += f'<p class="footnote">{esc(sec["footnote"])}</p>'
    return inner


def render_inline(sec: dict) -> str:
    names = [esc(it["name"]) for it in sec["items"]]
    joined = ' <span class="star">&#10033;</span> '.join(names)
    return render_intro(sec) + f'<p class="inline-list">{joined}</p>'


def render_feature(sec: dict) -> str:
    price = f'<div class="feature-price">{fmt_price(sec.get("price",""))}</div>' if sec.get("price") else ""
    descs = "".join(f'<p class="feature-desc">{esc(d)}</p>' for d in sec.get("desc", []))
    opts = "".join(f'<p class="feature-opt">{esc(o)}</p>' for o in sec.get("options", []))
    extras = ""
    if sec.get("columns"):
        cols = "".join(f'<div class="col">{items_block(c)}</div>' for c in sec["columns"])
        extras = f'<div class="cols-2 feature-extras">{cols}</div>'
    return price + descs + opts + extras


LAYOUTS = {
    "split": lambda s: render_split(s, 2),
    "split-three": lambda s: render_split(s, 3),
    "list": render_list,
    "inline": render_inline,
    "feature": render_feature,
}


def render_section(sec: dict) -> str:
    body = LAYOUTS[sec["layout"]](sec)
    return f'<section class="sec sec-{sec["id"]}">{render_header(sec)}{body}</section>'


def render_masthead(brand: dict, show_phone: bool) -> str:
    brandblock = (
        f'<div class="logo">{esc(brand["name"])}</div>'
        f'<div class="sublogo">{esc(brand["subtitle"])}</div>'
    )
    phone = brand.get("phone")
    if show_phone and phone:
        pill = f'<div class="phone">{esc(phone)}</div>'
        return (
            '<header class="masthead masthead--phone">'
            f'{pill}'
            f'<div class="brandblock">{brandblock}</div>'
            f'{pill}'
            "</header>"
        )
    return f'<header class="masthead">{brandblock}</header>'


def render_page(page: dict, brand: dict, disclaimer: str, revision: str,
                show_phone: bool = False) -> str:
    head = render_masthead(brand, show_phone)
    secs = "\n".join(render_section(s) for s in page["sections"])
    foot = (
        '<footer class="disclaimer">'
        f'<span class="leaf">&#10047;</span> {esc(disclaimer)} '
        f'<span class="rev">{esc(revision)}</span>'
        "</footer>"
    )
    return f'<article class="page" id="{page["id"]}">{head}{secs}{foot}</article>'


# ---------------------------------------------------------------------------
# CSS  (screen-responsive + print)
# ---------------------------------------------------------------------------

CSS = """
__FONTFACE__

:root{
  /* edit these to retune the look */
  --paper:#f1e7c8;           /* warm cream menu stock (SCREEN ONLY) */
  --ink:#221d15;             /* warm near-black ink */
  --accent:#8a2222;          /* brick red headers */
  --rule:#1a1610;            /* thick black rules */
  --leader:#b0a484;          /* dotted leader dots (warm gray) */
  --muted:#4c4536;           /* warm muted serif (descriptions) */
  --base:15px;               /* nudge this to fit print pages */

  --font-logo:'BrandtsBlackletter',Georgia,serif;
  --font-head:'BrandtsBlackletter',Georgia,serif;
  --font-body:Georgia,'Times New Roman','Times',serif;
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:#272019;        /* dark warm surround so the cream page glows */
  color:var(--ink);
  font-family:var(--font-body);
  font-size:var(--base);
  line-height:1.3;
  -webkit-font-smoothing:antialiased;
}

.page{
  position:relative;
  background-color:var(--paper);
  /* faint paper grain (screen only; print resets to plain white) */
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.14 0 0 0 0 0.10 0 0 0 0 0.05 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  background-repeat:repeat;
  max-width:860px;
  margin:30px auto;
  padding:42px 50px 32px;
  box-shadow:0 8px 38px rgba(0,0,0,.5);
  border:1px solid #d8c9a2;
}

/* masthead -------------------------------------------------------------- */
.masthead{text-align:center;margin-bottom:8px;}
.masthead--phone{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:0 20px;
}
.masthead--phone .brandblock{grid-column:2;}
.phone{
  justify-self:center;
  font-family:var(--font-body);
  font-weight:700;
  color:#c01f24;
  font-size:1.7rem;
  letter-spacing:.005em;
  white-space:nowrap;
  border:2px solid var(--leader);
  border-radius:16px;
  padding:.16em .58em;
  font-variant-numeric:tabular-nums;
}
.masthead--phone .phone:first-child{justify-self:start;}
.masthead--phone .phone:last-child{justify-self:end;}
.logo{
  font-family:var(--font-logo);
  font-size:3.5rem;
  line-height:.9;
  letter-spacing:.5px;
}
.sublogo{
  font-family:var(--font-body);
  font-weight:700;
  letter-spacing:.42em;
  font-size:.82rem;
  padding-left:.42em;
  margin-top:5px;
}

/* section titles -------------------------------------------------------- */
.sec{
  border-top:3px solid var(--rule);
  padding-top:8px;
  margin-top:14px;
}
.sec-title{
  font-family:var(--font-head);
  color:var(--accent);
  text-align:center;
  font-weight:400;
  font-size:1.62rem;
  margin:.06em 0 .42em;
  line-height:1.02;
  position:relative;
}
.eyebrow{
  font-family:var(--font-body);
  display:inline-block;
  font-size:.46em;
  font-weight:700;
  text-transform:uppercase;
  color:var(--ink);
  letter-spacing:.05em;
  vertical-align:.62em;
  margin-right:.34em;
  line-height:1;
}
.hand{font-family:var(--font-body);color:var(--accent);font-size:.66em;vertical-align:.1em;margin-right:.1em;}

/* intros ---------------------------------------------------------------- */
.intro,.intro-split{
  font-size:.82rem;color:var(--muted);margin:0 0 .5em;
}
.intro{text-align:center;}
.intro-split{
  display:grid;grid-template-columns:1fr 1fr;gap:0 26px;
  text-align:center;
}
.footnote{
  font-size:.78rem;color:var(--muted);text-align:center;
  margin:.55em 0 0;
}

/* item rows ------------------------------------------------------------- */
.item{margin:.34em 0;break-inside:avoid;}
.row{display:flex;align-items:baseline;width:100%;}
.iname{font-weight:700;white-space:nowrap;}
.iprice{white-space:nowrap;font-variant-numeric:tabular-nums;padding-left:.4em;}
.leader{
  flex:1 1 auto;
  align-self:flex-end;
  border-bottom:1.5px dotted var(--leader);
  margin:0 .25em .26em;
  min-width:1.4em;
}
.row.no-price .iname{white-space:normal;}
.idesc{font-size:.8rem;color:var(--muted);margin-top:.04em;max-width:46em;}

/* column grids ---------------------------------------------------------- */
.cols-2{display:grid;grid-template-columns:1fr 1fr;gap:0 30px;}
.cols-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 24px;}
.cols-2 .col+.col,
.cols-3 .col+.col{border-left:1px solid var(--rule);padding-left:30px;}
.cols-3 .col+.col{padding-left:24px;}
.list{max-width:100%;}

/* inline list (potato choices) ----------------------------------------- */
.inline-list{
  text-align:center;font-weight:700;font-size:.96rem;margin:.2em 0 .2em;
  line-height:1.5;
}
.star{color:var(--accent);font-weight:400;}

/* feature (the burger) -------------------------------------------------- */
.feature-price{
  text-align:center;font-weight:700;font-size:1.15rem;margin:.1em 0 .35em;
}
.feature-desc{text-align:center;margin:.12em 0;font-size:.92rem;}
.feature-opt{
  text-align:center;margin:.16em 0;font-size:.82rem;color:var(--muted);
}
.feature-extras{margin-top:.7em;}

/* disclaimer ------------------------------------------------------------ */
.disclaimer{
  border-top:3px solid var(--rule);
  margin-top:16px;padding-top:8px;
  font-size:.72rem;color:var(--muted);
}
.rev{float:right;}
.leaf,.star,.hand{user-select:none;}

/* ---------------- responsive (web) ---------------- */
@media (max-width:640px){
  body{font-size:14px;}
  .page{margin:0;padding:24px 18px 20px;box-shadow:none;border:0;max-width:100%;}
  .logo{font-size:2.6rem;}
  .masthead--phone{gap:0 8px;}
  .phone{font-size:.92rem;border-radius:10px;padding:.12em .45em;}
  .cols-2,.cols-3,.intro-split{grid-template-columns:1fr;gap:0;}
  .cols-2 .col+.col,.cols-3 .col+.col{
    border-left:0;padding-left:0;border-top:1px solid #ddd8cd;
    margin-top:.5em;padding-top:.5em;
  }
  .intro-split{gap:.2em 0;}
  .idesc{max-width:none;}
  .rev{float:none;display:block;margin-top:.3em;}
}

/* ---------------- print / PDF ---------------- */
@media print{
  @page{ size:__PAGESIZE__; margin:0.36in 0.5in; }
  /* Sizes tuned so the legal (8.5x14) sheet fills top-to-bottom without spilling
     onto a third page. The root font-size scales every rem-based size at once.
     The page stays WHITE (we print on cream stock; a cream fill would muddy it).*/
  html{font-size:19.5px;}
  body{background:#fff;font-size:13.3px;line-height:1.25;}
  .page{
    box-shadow:none;border:0;margin:0;max-width:none;width:100%;
    padding:0;background:#fff;
    page-break-after:always;
  }
  .page:last-child{page-break-after:auto;}
  .masthead{margin-bottom:3px;}
  .masthead--phone{gap:0 14px;}
  .phone{font-size:1.25rem;border-radius:12px;padding:.12em .5em;}
  .logo{font-size:3rem;}
  .sec{margin-top:10px;padding-top:6px;break-inside:avoid;}
  .sec-title{font-size:1.4rem;margin:.05em 0 .3em;}
  .item{margin:.28em 0;break-inside:avoid;}
  .idesc{margin-top:0;}
  .intro,.intro-split{margin-bottom:.32em;}
  .footnote{margin-top:.35em;}
  .disclaimer{margin-top:11px;padding-top:7px;}
  .feature-desc{margin:.06em 0;}
  .feature-opt{margin:.1em 0;}
  a{color:inherit;text-decoration:none;}
}
"""


PAGE_SIZES = {"letter": "8.5in 11in", "legal": "8.5in 14in"}


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
__CSS__
</style>
</head>
<body>
__BODY__
</body>
</html>
"""


def render_body(data: dict, show_phone: bool) -> str:
    brand = data["brand"]
    return "\n".join(
        render_page(p, brand, data["disclaimer"], data["revision"], show_phone)
        for p in data["pages"]
    )


def standalone_html(data: dict, page_choice: str, show_phone: bool) -> str:
    """A complete, self-contained HTML doc (inline CSS + embedded font)."""
    css = (
        CSS
        .replace("__FONTFACE__", font_face_css())
        .replace("__PAGESIZE__", PAGE_SIZES.get(page_choice, PAGE_SIZES["legal"]))
    )
    brand = data["brand"]
    return (
        HTML_TEMPLATE
        .replace("__TITLE__", f'{brand["name"]} {brand["subtitle"]} — Menu')
        .replace("__CSS__", css)
        .replace("__BODY__", render_body(data, show_phone))
    )


# Generated files land in the brandts-of-palatine project's src/content/.
CONTENT = HERE.parent / "src" / "content"
BODY_HEADER = (
    "<!-- GENERATED from menu/menu.json by menu/build.py — DO NOT EDIT directly.\n"
    "     To change the menu, edit menu/menu.json then run `npm run menu`. -->\n"
)


def build_all(page_choice: str = "legal") -> None:
    data = json.loads((HERE / "menu.json").read_text(encoding="utf-8"))
    CONTENT.mkdir(parents=True, exist_ok=True)

    # 1) Standalone carryout menu (phone in masthead) -> source for the PDF.
    (CONTENT / "menu-carryout.html").write_text(
        standalone_html(data, page_choice, show_phone=True), encoding="utf-8"
    )
    # 2) On-page body partial (no phone; wrapped in .menu-document) -> the website,
    #    styled by public/css/menu.css and injected by src/pages/menu.js.
    body = f'<div class="menu-document">\n{render_body(data, show_phone=False)}\n</div>\n'
    (CONTENT / "menu-body.html").write_text(BODY_HEADER + body, encoding="utf-8")

    print(f"wrote {CONTENT / 'menu-carryout.html'}")
    print(f"wrote {CONTENT / 'menu-body.html'}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Generate the menu HTML from menu.json")
    ap.add_argument("--page", choices=list(PAGE_SIZES), default="legal",
                    help="print page size for the carryout PDF (default: legal)")
    args = ap.parse_args()
    build_all(args.page)
