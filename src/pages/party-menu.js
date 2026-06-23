const { pageHeader, section, img } = require("../templates/components");

module.exports = {
  slug: "party-menu.html",
  title: "Pub Room / Party Menu",
  description:
    "Host your event in Brandt's Pub Room. View our party menu options.",
  render() {
    return (
      pageHeader(
        "Pub Room / Party Menu",
        "Host your gathering in our Pub Room."
      ) +
      section(
        `
      <div class="menu-pages single">
        <figure class="menu-page">${img(
          "Pub-Room-Party-Menu.jpg",
          "Brandt's of Palatine Pub Room party menu"
        )}</figure>
      </div>
      <p class="note center">To book the Pub Room or ask about party options, call
        <a href="tel:+18474964388">847-496-4388</a> or
        <a href="contact.html">send us a message</a>.</p>`,
        { cls: "menu-section" }
      )
    );
  },
};
