const { pageHeader, section, contactForm, contactCard, img } = require("../templates/components");

module.exports = {
  slug: "contact.html",
  title: "Contact Us",
  description: "Get in touch with Brandt's of Palatine.",
  render() {
    return (
      pageHeader("Contact Us", "We'd love to hear from you.") +
      section(
        `
      <div class="contact-grid">
        <div class="contact-form-col">
          ${contactForm()}
        </div>
        <div class="contact-aside">
          ${img("Cheeseburger.png", "A Brandt's cheeseburger")}
          ${contactCard()}
        </div>
      </div>`,
        { cls: "contact-section" }
      )
    );
  },
};
