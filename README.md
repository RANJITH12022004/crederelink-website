# Crederelink Fintech — Website

Static marketing website for Crederelinkfintech Pvt. Ltd., Hyderabad. Plain HTML/CSS/JS — no build step, no dependencies.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Home |
| `services.html` | All services (trade finance, credit & risk, advisory, loan programmes) |
| `features.html` | Platform features and the 5-step workflow |
| `about.html` | Mission, values, CEO message, addresses |
| `contact.html` | Contact form, contact details, map |
| `404.html` | Not-found page (served automatically by GitHub Pages) |
| `styles.css` | All styling, light + dark themes |
| `main.js` | Theme toggle, mobile nav, scroll animations, contact form |
| `assets/` | Logo, favicon, SVG icon sprite |

## Run locally

Open `index.html` in a browser, or serve the folder (the SVG icon sprite requires http):

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Contact form setup (one-time, ~2 minutes)

The form is wired for [Formspree](https://formspree.io) so messages arrive directly at `info@crederelinkfintech.com` without a backend:

1. Sign up free at formspree.io with the business email.
2. Create a new form; you'll get a form ID like `mqkrzvab`.
3. In `main.js`, replace `YOUR_FORM_ID` with that ID:

```js
var FORMSPREE_ID = "mqkrzvab";
```

Until this is done, the form falls back to opening the visitor's email app with a pre-filled message.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `crederelink-website`).
2. In the repo: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

## Connect the custom domain

1. Create a file named `CNAME` (no extension) in the repo root containing just the domain, e.g. `crederelinkfintech.com`.
2. At the domain registrar, add DNS records:
   - Apex domain (`crederelinkfintech.com`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` subdomain: `CNAME` record → `<username>.github.io`
3. In **Settings → Pages → Custom domain**, enter the domain and enable **Enforce HTTPS** once the certificate is issued.

If the final domain is different from `crederelinkfintech.com`, update the `canonical`/`og:` URLs in each HTML file, plus `robots.txt` and `sitemap.xml`.
