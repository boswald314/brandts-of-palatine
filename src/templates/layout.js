/* Page shell: <head>, header + nav, footer. Wraps each page's body HTML. */
const site = require("../data/site");

function navItem(item, currentHref) {
  const isActive =
    item.href === currentHref ||
    (item.children || []).some((c) => c.href.split("#")[0] === currentHref);
  if (item.children && item.children.length) {
    const sub = item.children
      .map(
        (c) =>
          `<li><a href="${c.href}">${escapeHtml(c.label)}</a></li>`
      )
      .join("");
    return `
      <li class="nav-item has-dropdown${isActive ? " active" : ""}">
        <a href="${item.href}" aria-haspopup="true" aria-expanded="false">${escapeHtml(
      item.label
    )} <span class="caret" aria-hidden="true">▾</span></a>
        <ul class="dropdown">${sub}</ul>
      </li>`;
  }
  return `<li class="nav-item${isActive ? " active" : ""}"><a href="${item.href}">${escapeHtml(
    item.label
  )}</a></li>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render({ title, description, currentHref, body, bodyClass = "", head = "" }) {
  const pageTitle =
    currentHref === "index.html"
      ? `${site.name} — ${site.tagline}`
      : `${title} — ${site.name}`;
  const navHtml = site.nav.map((i) => navItem(i, currentHref)).join("\n");
  const a = site.address;

  return `<!doctype html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description || site.description)}" />
  <link rel="icon" href="assets/images/favicon.ico" />
  <meta property="og:site_name" content="${escapeHtml(site.name)}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content="${escapeHtml(description || site.description)}" />
  <meta property="og:image" content="assets/images/brandts-acylic.JPG" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  ${head}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": ${JSON.stringify(site.name)},
    "image": "assets/images/brandts-acylic.JPG",
    "servesCuisine": "American",
    "telephone": ${JSON.stringify(site.phone)},
    "email": ${JSON.stringify(site.email)},
    "address": {
      "@type": "PostalAddress",
      "streetAddress": ${JSON.stringify(a.street)},
      "addressLocality": ${JSON.stringify(a.city)},
      "addressRegion": ${JSON.stringify(a.state)},
      "postalCode": ${JSON.stringify(a.zip)}
    }
  }
  </script>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="index.html">
        <span class="brand-name">${escapeHtml(site.name)}</span>
        <span class="brand-tag">Palatine, Illinois</span>
      </a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="primary-nav">
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-nav" aria-label="Primary">
        <ul class="nav-list">
${navHtml}
        </ul>
        <div class="nav-cta">
          <a class="btn btn-sm" href="${site.phoneHref}">${escapeHtml(site.phone)}</a>
        </div>
      </nav>
    </div>
  </header>

  <main id="main">
${body}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <div class="footer-brand">${escapeHtml(site.name)}</div>
        <p class="footer-tag">${escapeHtml(site.tagline)}</p>
      </div>
      <div class="footer-col">
        <h4>Visit</h4>
        <p>${escapeHtml(a.street)}<br />${escapeHtml(a.city)}, ${escapeHtml(a.state)} ${escapeHtml(
    a.zip
  )}</p>
        <p><a href="${site.phoneHref}">${escapeHtml(site.phone)}</a></p>
      </div>
      <div class="footer-col">
        <h4>Hours</h4>
        <p>Mon–Thu 11a–9:30p<br />Fri–Sat 11a–10:30p<br />Sun Closed</p>
      </div>
      <div class="footer-col">
        <h4>Follow</h4>
        <p class="footer-social">
          <a href="${site.social.facebook}" rel="noopener" target="_blank">Facebook</a>
          <a href="${site.social.twitter}" rel="noopener" target="_blank">Twitter</a>
          <a href="mailto:${site.email}">Email</a>
        </p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span id="year">2026</span> ${escapeHtml(site.name)}. All rights reserved.</p>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>`;
}

module.exports = { render, escapeHtml };
