const site = require("../data/site");
const { img } = require("../templates/components");

module.exports = {
  slug: "index.html",
  title: "Home",
  description: site.description,
  render() {
    return `
  <section class="hero">
    <div class="hero-media">${img(
      "file1781279564609.jpg",
      "Brandt's of Palatine"
    )}</div>
    <div class="hero-overlay"></div>
    <div class="hero-content container">
      <p class="eyebrow">Palatine, Illinois &middot; Est. 1950s</p>
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
      <div class="gallery">
        <figure class="gallery-item">${img("Cheeseburger.png", "Brandt's cheeseburger")}</figure>
        <figure class="gallery-item">${img("file0001228971491.jpg", "Inside Brandt's of Palatine")}</figure>
        <figure class="gallery-item">${img("Patio-with-Lights.jpg", "Outdoor patio with lights")}</figure>
        <figure class="gallery-item">${img("brandts-acylic.JPG", "Brandt's of Palatine sign")}</figure>
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
