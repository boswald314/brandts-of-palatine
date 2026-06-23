const { pageHeader, section, hoursTable } = require("../templates/components");

module.exports = {
  slug: "hours.html",
  title: "Hours",
  description: "Brandt's of Palatine hours of operation.",
  render() {
    return (
      pageHeader("Hours") +
      section(
        `
      <div class="narrow center">
        ${hoursTable()}
        <p class="center"><a class="btn btn-ghost" href="location.html">Get directions →</a></p>
      </div>`
      )
    );
  },
};
