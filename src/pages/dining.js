const { pageHeader, section, img } = require("../templates/components");

module.exports = {
  slug: "dining.html",
  title: "Indoor & Outdoor Dining",
  description:
    "Brandt's of Palatine offers indoor and outdoor dining — enjoy our patios with Adirondack chairs and bags games.",
  render() {
    return (
      pageHeader(
        "Indoor & Outdoor Dining",
        "Enjoy our patios, Adirondack chairs, and bags games."
      ) +
      section(
        `
      <div class="dining-grid">
        <figure class="dining-item">${img(
          "Outdoor-Dining.jpg",
          "Outdoor dining at Brandt's of Palatine"
        )}</figure>
        <figure class="dining-item">${img(
          "Patio-with-Lights.jpg",
          "Brandt's patio with lights"
        )}</figure>
      </div>
      <p class="narrow center">Please enjoy our Adirondack chairs on the outdoor
        patios and bags games nearby. Indoor seating is available year-round.</p>
      <p class="center"><a class="btn" href="location.html">Plan your visit →</a></p>`,
        { cls: "dining-section" }
      )
    );
  },
};
