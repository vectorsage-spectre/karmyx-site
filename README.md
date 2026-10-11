# Karmyx website

The public marketing site for **Karmyx** ([karmyx.co.in](https://karmyx.co.in)). It covers:

- print-on-demand personalised merchandise
- original digital designs
- software and online services

The site is plain **HTML, CSS and vanilla JS**. There is no build step and nothing to install.

```
index.html              Home page (all sections, smooth-scroll anchors)
privacy.html            Privacy Policy (DPDP Act 2023 aware). DRAFT
terms.html              Terms of Use. DRAFT
shipping-returns.html   Shipping & Returns. DRAFT
404.html                Not-found page (GitHub Pages serves it automatically)
site.config.js          ← All links and contact details live here
assets/css/styles.css   Design tokens + all styles (light/dark themes)
assets/js/main.js       Menu, theme toggle, filters, quick view, FAQ, contact form
assets/images/          Logo, favicons, OG image, product mockups, photos
robots.txt, sitemap.xml, site.webmanifest, favicon.ico, .nojekyll
```

## Run locally

```bash
cd karmyx_website
python3 -m http.server 8000
# open http://localhost:8000
```

Any static server works. Opening `index.html` directly with `file://` mostly works too, but the contact form and some browsers behave better over http.

## Edit links, email, phone and legal details

Open `site.config.js`:

| Key | What it does |
| --- | --- |
| `STORE_URL` | Reserved for when the online store launches. The site is a showcase for now and doesn't link to a store. |
| `GAME_URL` | The Infiltrators "Play now" button (`https://game.karmyx.co.in`) |
| `EMAIL`, `PHONE`, `ADDRESS` | Contact section, FAQ, footer |
| `FORM_ENDPOINT` | Contact form target, e.g. a [Formspree](https://formspree.io) URL. When empty, the form opens the visitor's email app with the message pre-filled (`mailto:`). |
| `SOCIAL.*` | Footer social icons. An empty value hides that icon. |
| `LEGAL_NAME_PLACEHOLDER`, `GSTIN_PLACEHOLDER` | Shown in the footer when filled in. Currently `Karmyx (OPC) Pvt. Ltd.` and `xxx`. Replace `xxx` with the real GSTIN once issued, or set it to `""` to hide it. |

Each HTML file also keeps a real default `href`, so links still work if JavaScript is off.

**Contact form with Formspree (free):**
1. Create a form at formspree.io using karmyxbusiness@gmail.com.
2. Copy the endpoint (`https://formspree.io/f/xxxxxxx`) into `FORM_ENDPOINT`.
3. Commit and push.

## Deploy (GitHub Pages)

The repo is `vectorsage-spectre/karmyx-site`. Pages serves the `main` branch from the root folder, and every push to `main` redeploys within about a minute.

Before a custom domain is connected, the preview URL is https://vectorsage-spectre.github.io/karmyx-site/. Asset paths are relative so the preview works. The only exception is `404.html`, which uses root paths and looks right only on the custom domain.

### Connect karmyx.co.in (GoDaddy)

**1. In GoDaddy**, go to *My Products → karmyx.co.in → DNS → Manage DNS*.
   - Delete any existing **A** record for `@`, and any "Parked" or forwarding record.
   - Add these records:

| Type  | Name | Value | TTL |
| ----- | ---- | ----- | --- |
| A     | @    | 185.199.108.153 | 1 hour |
| A     | @    | 185.199.109.153 | 1 hour |
| A     | @    | 185.199.110.153 | 1 hour |
| A     | @    | 185.199.111.153 | 1 hour |
| CNAME | www  | vectorsage-spectre.github.io | 1 hour |

   - Optional IPv6: AAAA records for `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**2. In GitHub**, go to *repo → Settings → Pages → Custom domain*, enter `karmyx.co.in` and save. This also commits a `CNAME` file.

**3.** Once the DNS check turns green, tick **Enforce HTTPS**. The certificate can take from a few minutes to about an hour.

**4. Recommended:** under *GitHub → Settings (your profile) → Pages*, verify `karmyx.co.in` so nobody else can claim it.

### The `game` subdomain

Infiltrators is hosted separately. In GoDaddy, add a **CNAME** record with name `game`, pointing to whatever host your game platform gives you (for example `your-app.onrender.com`). Then add `game.karmyx.co.in` as a custom domain on that host. If the game's URL ever changes, update `GAME_URL` in `site.config.js`.

### Other hosts

The site is fully static, so it also runs on these hosts:
- **Netlify:** drag the folder in, or connect the repo with publish directory `/`.
- **Cloudflare Pages:** same as Netlify.
- **Render:** create a "Static Site" with build command empty and publish directory `.`.

## Replace images

| File | Used for | Replace with |
| --- | --- | --- |
| `assets/images/products/product-*.svg` (12 files: tee, hoodie, mug, tote, notebook, poster, phonecase, giftbox, stickers, cap, cushion, bottle) | Product cards, hero, quick view | Real product photos. Use a square crop, ideally WebP at about 800×800 on a plain or transparent background. Keep the file names, or update the `src` in `index.html`. |
| `assets/images/infiltrators-art.svg` | Labs / Play card | Real game key art (16:10, dark) |
| `assets/images/photos/life-*.webp` | "Made for real life" gallery (4:5) | Your own lifestyle and product photos |
| `assets/images/photos/service-*.webp` | Service cards (3:2) | Photos of your own work or workspace |
| `assets/images/photos/about-team-*.webp` | About section (8:9) | A photo of you or your workspace |
| `assets/images/photos/bulk-gifts-*.webp` | Bulk orders banner (square) | Your own gift-set photo |
| `assets/images/og-image.png` | Social share preview (1200×630) | Can stay, or be regenerated with real photos |
| `assets/images/logo*.svg`, `favicon*`, `icon-*.png`, `apple-touch-icon.png`, `/favicon.ico` | Brand mark | Replace if the logo changes. The header and footer use an inline copy of the mark (`<symbol id="logo-mark">`) at the top of each HTML file, so update that too. |

Photos come in `-480/-960` (or `-640/-1280`, `-720/-1440`) pairs for `srcset`. To convert your own photos, use `cwebp -q 72 in.jpg -o out.webp`.

## Photo credits

The lifestyle and service photos are from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license). The license allows free commercial use and does not require attribution, but credit is appreciated. They were downloaded, cropped and converted to WebP, not hotlinked.

| File | Unsplash photo ID |
| --- | --- |
| life-tee | photo-1521572163474-6864f9cf17ab |
| life-hoodie | photo-1556821840-3a63f95609a7 |
| life-mug | photo-1514228742587-6b1558fcca3d |
| life-tote | photo-1544816155-12df9643f363 |
| life-desk | photo-1497032628192-86f99bcd76bc |
| life-home | photo-1513694203232-719a280e022f |
| life-packaging | photo-1595246140625-573b715d11dc |
| service-design | photo-1581291518857-4e27b48ff24e |
| service-web | photo-1531403009284-440f080d1e12 |
| service-ai | photo-1573164713988-8665fc963095 |
| service-ecommerce | photo-1586953208448-b95a79798f07 |
| service-marketing | photo-1460925895917-afdab827c52f |
| service-consulting | photo-1556761175-b413da4baf72 |
| about-team | photo-1522202176988-66273c2fd55f |
| bulk-gifts | photo-1607344645866-009c320b63e0 |

(Open `https://images.unsplash.com/<id>` to view the source.)

The logo, product mockups, Infiltrators artwork and OG image are original artwork made for Karmyx.

## Analytics

No tracking ships by default. `index.html` has a commented-out slot for Plausible or Google Analytics 4 in `<head>`. If you enable one, also update `privacy.html`.

## Assumptions

- **Brand and colours:** a new original logo (a geometric "K" with a rising arrow). Palette: midnight `#1B1F3B`, saffron `#F5A524`, teal `#2EC4B6`, cream `#FAF7F2`. Fonts are Sora for headings and Inter for body text.
- **Showcase only:** there are no real products yet. The 12 product cards are sample POD designs (labelled "Sample design"). Their "Enquire" buttons lead to the contact form, and there are no prices or store links. When the store launches, add "View in store" links using `data-config-href="STORE_URL"`.
- **Delivery promises:** the FAQ and Shipping page use typical POD timelines. Please confirm or adjust these:
  - printing: 2–4 working days
  - delivery: 3–7 working days
  - cancellation window: 12 hours
  - damage reporting: within 7 days
  - refunds: within 5–7 working days
- **Exchanges:** one size exchange for non-personalised items.
- **Contact:** +91 63976 04558, karmyxbusiness@gmail.com, Rudrapur, Uttarakhand.
- **Legal entity:** Karmyx (OPC) Pvt. Ltd. Courts: Rudrapur, Uttarakhand.
- **Grievance contact:** the Privacy Policy uses the company email as the grievance contact.
- **Legal pages:** these are drafts and should be reviewed before launch, ideally by a professional.
- **Roadmap:** the "What's next" strip shows traditional foods (mangodi) as "Coming soon". Financial services are intentionally not mentioned.
- **Theme:** dark mode follows the system setting until the visitor uses the toggle. Their choice is then remembered with `localStorage`.

## Checks run

- html-validate (recommended rules): no errors.
- Internal links, anchors, `alt` text and image dimensions: all OK.
- Interactions tested in headless Chrome: menu (including Esc), filters, quick view, FAQ, theme toggle, form validation and mailto fallback. No console errors.
- Horizontal overflow at a 390px viewport: none.
- Lighthouse (mobile, local server): Performance 99, Accessibility 100, Best Practices 100, SEO 100.
