const { pageHeader, section, img } = require("../templates/components");

module.exports = {
  slug: "history.html",
  title: "Our History",
  description:
    "Brandt's of Palatine is a 130-year-old farmhouse that has been a restaurant since the 1950s.",
  render() {
    return (
      pageHeader("Our History") +
      section(
        `
      <div class="history-grid">
        <div class="history-media">${img(
          "brandts-front-facade.jpeg",
          "The historic stone farmhouse that is home to Brandt's of Palatine"
        )}</div>
        <div class="history-text">
          <p class="lede">Brandt's is a 130-year-old farmhouse that has been a
            restaurant since the 1950s.</p>
          <p>Generations of Palatine families have gathered here for burgers, drinks,
            and good times. Read more about the story behind Brandt's:</p>
          <p>
            <a class="btn btn-ghost" target="_blank" rel="noopener"
              href="https://patch.com/illinois/palatine/the-back-story-to-brandt-s-of-palatine">
              The back story of Brandt's (Palatine Patch) →</a>
          </p>
        </div>
      </div>`,
        { cls: "history-section" }
      )
    );
  },
};
