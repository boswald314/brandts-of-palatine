#!/usr/bin/env node
/* Renders every page module to a static .html file in public/. Run: npm run build */
const fs = require("fs");
const path = require("path");
const { render } = require("../src/templates/layout");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public");
const PAGES_DIR = path.join(ROOT, "src", "pages");

const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".js"));

let count = 0;
for (const file of pageFiles) {
  const page = require(path.join(PAGES_DIR, file));
  const html = render({
    title: page.title,
    description: page.description,
    currentHref: page.slug,
    body: page.render(),
    bodyClass: "page-" + page.slug.replace(".html", ""),
    head: page.head || "",
  });
  fs.writeFileSync(path.join(OUT, page.slug), html);
  console.log("  ✓ " + page.slug);
  count++;
}

// 404 page reuses the home layout shell with a small message.
const notFound = render({
  title: "Page not found",
  description: "Page not found",
  currentHref: "",
  body: `
  <section class="section narrow center" style="padding:6rem 0">
    <h1>Page not found</h1>
    <p>Sorry, we couldn't find that page.</p>
    <p><a class="btn" href="index.html">Back home</a></p>
  </section>`,
});
fs.writeFileSync(path.join(OUT, "404.html"), notFound);

console.log(`\nBuilt ${count} pages + 404 -> public/`);
