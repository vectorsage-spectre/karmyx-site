/**
 * Karmyx site configuration. Every page reads these values.
 *   data-config-href="STORE_URL"   -> sets href
 *   data-config-text="EMAIL"       -> sets text
 */
window.SITE_CONFIG = {
  SITE_URL: "https://karmyx.co.in",
  STORE_URL: "https://shop.karmyx.co.in",       // Shopify store
  GAME_URL: "https://www.game.karmyx.co.in",    // Mafia game on Render

  EMAIL: "karmyxbusiness@gmail.com",
  PHONE: "+91\u00A063976\u00A004558",
  ADDRESS: "Rudrapur, Uttarakhand, India",

  // Footer social icons. An empty value hides the icon.
  SOCIAL: {
    instagram: "",   // e.g. "https://instagram.com/karmyx.in"
    linkedin: "",
    x: "",
    youtube: "",
  },

  // Shown in the footer only when filled in. Fill after incorporation / GST registration.
  LEGAL_NAME: "",    // e.g. "Karmyx (OPC) Private Limited"
  GSTIN: "",
};
