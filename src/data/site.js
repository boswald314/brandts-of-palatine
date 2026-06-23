/*
 * SINGLE SOURCE OF TRUTH for the whole site.
 * Reorganizing the menu bar = edit the `nav` array below, then `npm run build`.
 * Business info, hours, and social links also live here so they stay consistent
 * across every page.
 */
module.exports = {
  name: "Brandt's of Palatine",
  shortName: "Brandt's",
  tagline: "A Palatine tavern tradition since the 1950s",
  description:
    "Brandt's of Palatine is a neighborhood pub in a 130-year-old farmhouse, " +
    "serving burgers and classic tavern fare in Palatine, Illinois for over 50 years.",

  phone: "847-496-4388",
  phoneHref: "tel:+18474964388",
  email: "brandtsofpalatine@gmail.com",

  address: {
    street: "807 W NW Hwy",
    city: "Palatine",
    state: "IL",
    zip: "60067",
    note: "Southwest corner of Northwest Highway and Quentin Road",
  },

  // Used by the keyless Google Maps embed on the Location page.
  mapQuery: "807 W Northwest Hwy, Palatine, IL 60067",

  hours: [
    { day: "Monday", time: "11:00 a.m. – 9:30 p.m." },
    { day: "Tuesday", time: "11:00 a.m. – 9:30 p.m." },
    { day: "Wednesday", time: "11:00 a.m. – 9:30 p.m." },
    { day: "Thursday", time: "11:00 a.m. – 9:30 p.m." },
    { day: "Friday", time: "11:00 a.m. – 10:30 p.m." },
    { day: "Saturday", time: "11:00 a.m. – 10:30 p.m." },
    { day: "Sunday", time: "Closed", closed: true },
  ],
  hoursNote: "The kitchen closes one hour before the posted restaurant closing time.",

  social: {
    facebook: "https://www.facebook.com/brandtsofpalatine",
    twitter: "https://twitter.com/brandtspalatine",
  },

  // Contact form: paste your Formspree form ID here (e.g. "xyzabcde") once you
  // sign up at https://formspree.io. Until then the form falls back to email.
  formspreeId: "",

  // ---- NAVIGATION ----------------------------------------------------------
  // Top-level items render in order. `children` become a dropdown.
  // The 3 old media pages (ABC, Chicago's Best Burgers, Off 53) are consolidated
  // under "Press". Move/rename/flatten freely — it's just data.
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Menu", href: "menu.html" },
    { label: "Hours", href: "hours.html" },
    { label: "Location", href: "location.html" },
    {
      label: "Press",
      href: "press.html",
      children: [
        { label: "ABC News Review", href: "press.html#abc" },
        { label: "Chicago's Best Burgers", href: "press.html#burgers" },
        { label: "Off 53 Video", href: "press.html#off53" },
        { label: "In the News", href: "press.html#articles" },
      ],
    },
    {
      label: "About",
      href: "history.html",
      children: [
        { label: "Our History", href: "history.html" },
        { label: "Outdoor Dining", href: "dining.html" },
      ],
    },
    { label: "Contact", href: "contact.html" },
  ],
};
