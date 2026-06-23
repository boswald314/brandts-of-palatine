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
          ${img("file3991282945508.jpg", "Brandt's of Palatine")}
          ${contactCard()}
        </div>
      </div>`,
        { cls: "contact-section" }
      )
    );
  },
};
