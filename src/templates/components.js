/* Small HTML-builder helpers shared by the page modules. */
const site = require("../data/site");
const { escapeHtml } = require("./layout");

const img = (file, alt = "", cls = "") =>
  `<img src="assets/images/${file}" alt="${escapeHtml(alt)}"${cls ? ` class="${cls}"` : ""} loading="lazy" />`;

function pageHeader(title, subtitle = "") {
  return `
  <section class="page-header">
    <div class="container">
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="lede">${escapeHtml(subtitle)}</p>` : ""}
    </div>
  </section>`;
}

function section(inner, { cls = "", id = "" } = {}) {
  return `
  <section class="section ${cls}"${id ? ` id="${id}"` : ""}>
    <div class="container">
${inner}
    </div>
  </section>`;
}

// Responsive 16:9 video embed (YouTube / Vimeo).
function videoEmbed(src, title) {
  return `
    <div class="video-frame">
      <iframe src="${src}" title="${escapeHtml(title)}" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>`;
}

function hoursTable() {
  const rows = site.hours
    .map(
      (h) =>
        `<tr class="${h.closed ? "is-closed" : ""}"><th scope="row">${escapeHtml(
          h.day
        )}</th><td>${escapeHtml(h.time)}</td></tr>`
    )
    .join("\n");
  return `
    <table class="hours-table">
      <tbody>
${rows}
      </tbody>
    </table>
    <p class="note">${escapeHtml(site.hoursNote)}</p>`;
}

function contactCard() {
  const a = site.address;
  return `
    <div class="contact-card">
      <div class="contact-row">
        <span class="contact-label">Call</span>
        <a href="${site.phoneHref}">${escapeHtml(site.phone)}</a>
      </div>
      <div class="contact-row">
        <span class="contact-label">Email</span>
        <a href="mailto:${site.email}">${escapeHtml(site.email)}</a>
      </div>
      <div class="contact-row">
        <span class="contact-label">Visit</span>
        <span>${escapeHtml(a.street)}, ${escapeHtml(a.city)}, ${escapeHtml(a.state)} ${escapeHtml(
    a.zip
  )}</span>
      </div>
      <div class="contact-social">
        <a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a>
        <a href="${site.social.twitter}" target="_blank" rel="noopener">Twitter</a>
      </div>
    </div>`;
}

// Contact form. POSTs to Formspree if an ID is configured; otherwise main.js
// intercepts submit and falls back to a pre-filled mailto: to the pub.
function contactForm() {
  const action = site.formspreeId
    ? `https://formspree.io/f/${site.formspreeId}`
    : "";
  return `
    <form class="contact-form" id="contactForm"
      ${action ? `action="${action}"` : ""} method="POST"
      data-email="${escapeHtml(site.email)}">
      <div class="field">
        <label for="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="cf-phone">Phone <span class="opt">(optional)</span></label>
        <input id="cf-phone" name="phone" type="tel" autocomplete="tel" />
      </div>
      <div class="field">
        <label for="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows="5" required></textarea>
      </div>
      <button class="btn" type="submit">Send message</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>`;
}

function mapEmbed() {
  const q = encodeURIComponent(site.mapQuery);
  return `
    <div class="map-frame">
      <iframe
        title="Map to ${escapeHtml(site.name)}"
        src="https://www.google.com/maps?q=${q}&output=embed"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>`;
}

module.exports = {
  img,
  pageHeader,
  section,
  videoEmbed,
  hoursTable,
  contactCard,
  contactForm,
  mapEmbed,
};
