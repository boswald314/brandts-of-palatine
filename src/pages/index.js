const fs = require("fs");
const path = require("path");
const site = require("../data/site");
const { img } = require("../templates/components");

// Homepage rotating gallery. Add new photos to public/assets/images/ and list
// them here. Only files that actually exist on disk are included at build time,
// so a not-yet-added photo never renders as a broken image.
const IMG_DIR = path.join(__dirname, "../../public/assets/images");
const GALLERY = [
  { file: "brandts-burger.jpg", alt: "A Brandt's cheeseburger and fries at the bar" },
  { file: "patio-night.jpg", alt: "The covered patio lit up at night" },
  { file: "boneless-wings.jpg", alt: "A basket of Brandt's boneless wings with ranch" },
  { file: "Patio-with-Lights.jpg", alt: "The patio at dusk with string lights" },
  { file: "old-fashioneds.jpg", alt: "Old fashioned cocktails at the bar" },
  { file: "Outdoor-Dining.jpg", alt: "Outdoor dining on the patio" },
].filter((g) => fs.existsSync(path.join(IMG_DIR, g.file)));

module.exports = {
  slug: "index.html",
  title: "Home",
  description: site.description,
  render() {
    return `
  <section class="hero">
    <div class="hero-media">${img(
      "brandts-sunset.jpg",
      "Brandt's of Palatine at sunset, with the burgers and BBQ ribs neon glowing"
    )}</div>
    <div class="hero-overlay"></div>
    <div class="hero-content container">
      <p class="eyebrow">Palatine, Illinois &middot; Est. 1950<span style="text-transform: lowercase">s</span></p>
      <h1>${site.name}</h1>
      <p class="hero-tag">A neighborhood tavern in a 130-year-old farmhouse — burgers,
        cold drinks, and good company for over half a century.</p>
      <div class="hero-actions">
        <a class="btn" href="menu.html">See the Menu</a>
        <a class="btn btn-ghost" href="location.html">Find Us</a>
      </div>
    </div>
  </section>

  <section class="section quick-strip">
    <div class="container quick-grid">
      <a class="quick-card" href="hours.html">
        <h3>Open Today</h3>
        <p>Mon–Thu 11a–9:30p<br/>Fri–Sat 11a–10:30p</p>
        <span class="quick-link">View hours →</span>
      </a>
      <a class="quick-card" href="location.html">
        <h3>Find Us</h3>
        <p>${site.address.street}<br/>${site.address.city}, ${site.address.state} ${site.address.zip}</p>
        <span class="quick-link">Get directions →</span>
      </a>
      <a class="quick-card" href="menu.html">
        <h3>The Menu</h3>
        <p>Famous burgers &amp; classic<br/>tavern favorites</p>
        <span class="quick-link">Browse menu →</span>
      </a>
    </div>
  </section>

  <section class="section welcome">
    <div class="container narrow center">
      <p class="eyebrow">Welcome back to Brandt's</p>
      <h2>A Palatine original since the 1950s</h2>
      <p>Tucked into a 130-year-old farmhouse on the corner of Northwest Highway and
        Quentin Road, Brandt's has been serving the Palatine community for generations.
        Pull up a chair inside or relax on our outdoor patios with Adirondack chairs and
        a game of bags.</p>
      <a class="btn btn-ghost" href="history.html">Our Story</a>
    </div>
  </section>

  <section class="section gallery-section">
    <div class="container">
      <div class="carousel${GALLERY.length <= 1 ? " is-single" : ""}" data-carousel
        aria-roledescription="carousel" aria-label="Photos of Brandt's of Palatine">
        <div class="carousel-viewport">
${GALLERY.map(
  (g, i) =>
    `          <figure class="carousel-slide${i === 0 ? " is-active" : ""}">${img(
      g.file,
      g.alt
    )}</figure>`
).join("\n")}
        </div>
        <button class="carousel-arrow prev" type="button" aria-label="Previous photo">&#8249;</button>
        <button class="carousel-arrow next" type="button" aria-label="Next photo">&#8250;</button>
        <div class="carousel-dots">
${GALLERY.map(
  (_g, i) =>
    `          <button class="carousel-dot${i === 0 ? " is-active" : ""}" type="button" aria-label="Show photo ${i + 1}"></button>`
).join("\n")}
        </div>
      </div>
    </div>
  </section>

  <section class="section cta-band">
    <div class="container center">
      <h2>Indoor &amp; outdoor dining available</h2>
      <p>Enjoy our Adirondack chairs on the patios and bags games nearby.</p>
      <a class="btn" href="dining.html">Plan your visit</a>
    </div>
  </section>`;
  },
};
