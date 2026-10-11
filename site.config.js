/**
 * Karmyx site configuration.
 * Edit the values here; every page reads links and contact details from this file.
 * Elements opt in with data attributes (see assets/js/main.js):
 *   data-config-href="STORE_URL"   -> sets href
 *   data-config-text="EMAIL"       -> sets text content
 */
window.SITE_CONFIG = {
  SITE_URL: "https://karmyx.co.in",

  // Online store (placeholder until the store is live)
  STORE_URL: "https://store.karmyx.co.in",

  // Infiltrators game (subdomain being connected)
  GAME_URL: "https://game.karmyx.co.in",

  // Contact
  EMAIL: "karmyxbusiness@gmail.com",
  PHONE: "",   // e.g. "+91 98765 43210" (leave empty to show "Phone: coming soon")
  ADDRESS: "", // e.g. "Jaipur, Rajasthan, India" (leave empty to show "India")

  // Contact form endpoint (e.g. "https://formspree.io/f/xxxxxxx").
  // Leave empty to fall back to opening the visitor's email app (mailto:).
  FORM_ENDPOINT: "",

  // Social profiles (leave a value empty to hide that icon)
  SOCIAL: {
    instagram: "https://instagram.com/",
    linkedin: "https://www.linkedin.com/",
    x: "https://x.com/",
    youtube: "https://www.youtube.com/",
  },

  // Legal details: incorporation is in progress.
  // Rendered in the footer ONLY when filled in. Do not guess these.
  LEGAL_NAME_PLACEHOLDER: "", // e.g. "Karmyx (OPC) Private Limited"
  GSTIN_PLACEHOLDER: "",      // e.g. "08ABCDE1234F1Z5"
};
