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
          <p class="lede">On the southwest corner of Northwest Highway<br/>
            (U.S. Route 14) and Quentin Road, right at the traffic light.</p>
          <p>You'll find us just west of downtown Palatine and its Metra station,
            in Chicago's northwest suburbs — the historic stone farmhouse on the corner.</p>
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
