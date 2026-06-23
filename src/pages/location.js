const site = require("../data/site");
const { pageHeader, section, mapEmbed } = require("../templates/components");

module.exports = {
  slug: "location.html",
  title: "Location & Phone",
  description:
    "Brandt's of Palatine is at 807 W NW Hwy, Palatine, IL — the SW corner of Northwest Highway and Quentin Road.",
  render() {
    const a = site.address;
    return (
      pageHeader("Location & Phone") +
      section(
        `
      <div class="location-grid">
        <div class="location-info">
          <h2>Find Us</h2>
          <p class="address-block">
            ${a.street}<br/>
            ${a.city}, ${a.state} ${a.zip}
          </p>
          <p>${a.note}.</p>
          <p class="phone-line"><span class="contact-label">Phone</span>
            <a href="${site.phoneHref}">${site.phone}</a></p>
          <p>
            <a class="btn" target="_blank" rel="noopener"
              href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                site.mapQuery
              )}">Get directions</a>
          </p>
        </div>
        <div class="location-map">
          ${mapEmbed()}
        </div>
      </div>`,
        { cls: "location-section" }
      )
    );
  },
};
