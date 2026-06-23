const fs = require("fs");
const path = require("path");

// Menu content lives in an editable HTML partial; styles in public/css/menu.css.
const body = fs.readFileSync(
  path.join(__dirname, "../content/menu-body.html"),
  "utf8"
);
// The blackletter logo font is optional — included only once extracted.
const hasFont = fs.existsSync(
  path.join(__dirname, "../../public/css/menu-font.css")
);

module.exports = {
  slug: "menu.html",
  title: "Menu",
  description:
    "Brandt's of Palatine menu — burgers, sandwiches, salads, fresh fish, ribs, and tavern classics.",
  head:
    (hasFont ? '<link rel="stylesheet" href="css/menu-font.css" />\n  ' : "") +
    '<link rel="stylesheet" href="css/menu.css" />',
  render() {
    return `
  <div class="menu-toolbar container">
    <p class="note">Dine in or carry out &middot; <a href="tel:+18474964388">847-496-4388</a></p>
    <button class="btn btn-sm" type="button" onclick="window.print()">Print / Save as PDF</button>
  </div>
${body}`;
  },
};
