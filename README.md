# Karmyx website

The brand home for **Karmyx** ([karmyx.co.in](https://karmyx.co.in)), an Indian streetwear label. The site tells the story and sends people to the Shopify store at [shop.karmyx.co.in](https://shop.karmyx.co.in).

Plain **HTML, CSS and vanilla JS**. No build step, nothing to install.

```
index.html              Home: Mentalist colour wall, T-shirts, story, how an order works,
                        custom/bulk orders, Mafia game, help/FAQ
privacy.html            Privacy Policy (DRAFT)
terms.html              Terms of Use (DRAFT)
shipping-returns.html   Shipping & Returns (DRAFT)
404.html                Not-found page (GitHub Pages serves it automatically)
site.config.js          ← links, contact details, socials, legal IDs
assets/css/styles.css   All styles (one design system for every page)
assets/js/main.js       Config links, mobile menu, colour wall
assets/images/products/ Product cutouts (WebP, transparent)
CNAME                   karmyx.co.in (keep this file)
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## The colour wall

The hero shows the Mentalist tee in 16 colours. Clicking a swatch swaps the photo and the background tint, and points the "Shop Mentalist in …" button at that exact Shopify variant (`?variant=<id>`). Arrow keys move between swatches.

**Add a colour or product:** export a transparent cutout about 600px wide as `-480.webp` and `-900.webp`, put it in `assets/images/products/`, then add a `<button class="swatch">` in `index.html` with `data-name`, `data-slug`, `data-variant` (Shopify variant ID) and `--c` (fabric colour).

## Edit links and details

Open `site.config.js`:

| Key | What it does |
| --- | --- |
| `STORE_URL` | The Shopify store, `https://shop.karmyx.co.in` |
| `GAME_URL` | Mafia game, `https://www.game.karmyx.co.in` |
| `EMAIL`, `PHONE`, `ADDRESS` | Help section and footer |
| `SOCIAL.*` | Footer icons. Empty hides the icon. |
| `LEGAL_NAME`, `GSTIN` | Footer, shown only when filled in |

Every link keeps a real default `href`, so it still works with JavaScript off.

## Deploy (GitHub Pages)

Repo `vectorsage-spectre/karmyx-site`. Pages serves `main` from the root folder; every push to `main` redeploys in about a minute.

DNS (GoDaddy) for reference:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | vectorsage-spectre.github.io |
| CNAME | www.game | mafia-game-itdg.onrender.com |
| CNAME | shop | Shopify (managed by Shopify) |

In *Settings → Pages*, keep **Enforce HTTPS** ticked.

## Design

- **Type:** Archivo (variable). Condensed, 900 weight for display headlines; normal width for body.
- **Colour:** night violet `#1A1030` base (from the logo), chalk `#F3EFE6` text, Mentalist yellow `#F7C21B` for primary buttons, sunrise `#FF6A1F` and magenta `#E5267B` from the logo, used sparingly.
- **Dark only.** Motion is one load moment in the hero plus the colour swap; both switch off under reduced-motion settings.

## Assumptions to confirm

- Delivery promises (FAQ and Shipping page): printing 2–4 working days, delivery 3–7 working days, damage reports within 7 days. Check these against Qikink.
- The legal pages are drafts and still mention design/software services. Review before relying on them.
- Social links, legal name and GSTIN are empty and hidden until filled in.

## Checks run

- Rendered in headless Chromium at 1440px and 390px: no horizontal overflow, no console errors, on every page.
- Colour wall: each swatch swaps image, alt text and the Shop link to the matching Shopify variant.

## Analytics

None ships by default. If you add Plausible or GA4, mention it in `privacy.html`.
