# Workspace Memory & Agent Guide (`AGENTS.md`)

Use this file to orient quickly at the start of a new session.

## Workspace Overview

- **Root**: `C:\Backup\31beta`
- **Source React App (reference only)**: `bilingual-ganoderma-coffee/` — Original Lovable AI project (TanStack Start + React 19 + Tailwind CSS v4 + Lucide + Supabase). Do not modify unless explicitly requested; it has its own `AGENTS.md`.
- **Visual Reference**:
  - Live site: `https://subroto-coffee.lovable.app` (and `https://subroto-coffee.lovable.app/distribuye`)
  - Local rendered HTML snapshot: `output.html`
- **Target Deliverable**: `vanilla-site/` — Plain HTML/CSS/JS pixel-identical conversion of the live site.
- **PHP Reference Template**: `30beta/` — Existing Vioniko landing page (`index_beta.php`, `style.css`, `script.js`, `assets/`).
- **PHP Landing Page Deliverable**: `31beta/` — Dynamic PHP conversion of `vanilla-site/` following `30beta/` conventions (`index_beta.php`, `style.css`, `script.js`, `assets/images/`, `assets/icons/favicon.ico`).

## PHP Landing Page (`31beta/`)

- **Bootstrap (`index_beta.php`)**: Uses `to_utf8()`, CORS/OPTIONS headers, `?mode=edit` redirect to `https://vioniko.com/landingpage/3beta/index_beta.php`, `$template = 196`, and `include_once('../../subdominio_ini.php')`.
- **Dynamic fields**:
  - WhatsApp number from `$rowUSU['whatsapp']` (digits sanitized, fallback `528110169320`) rendered into all `wa.me` links and `body[data-whatsapp]` for `script.js`.
  - Plantation video from `$video` (fallback `https://www.youtube-nocookie.com/embed/6Y15eqJ37O8?autoplay=1&rel=0`) passed via `body[data-video]`; `script.js` supports both YouTube embeds (auto-normalized) and direct `.mp4`/`.webm`/`.ogg` video overrides.
  - Hidden campaign tracking inputs (`pais`, `ciudad`, `estado`, `usuario`, `template`, `idioma`) at top of `<body>` and inside `#distributor-form`; `script.js` keeps all `input[name="idioma"]` synced with the active `ES`/`EN` language.
  - `#distributor-form` submits via standard `POST` to `../../registro_prospecto_subdominio_autoresponder.php` with `<?php include('../campana_user.php'); ?>` and geo/user/template/idioma hidden inputs (client-side validation blocks empty/invalid email).
  - Copyright year rendered via `date('Y')`.
- **Assets**: All 12 `.jpg` images in `31beta/assets/images/` and `favicon.ico` in `31beta/assets/icons/favicon.ico`. `31beta/style.css` is byte-identical to `vanilla-site/style.css`.

## Strict Rules for `vanilla-site/`

1. **Exact file structure**: Keep only 3 code files in `vanilla-site/` (`index.html`, `style.css`, `script.js`) plus the `images/` folder. Do not add extra files or build configs inside `vanilla-site/`.
2. **Zero dependencies**: No frameworks, JS libraries, Tailwind CSS, CDNs (except Google Fonts `Fraunces` & `Montserrat`), or build step.
3. **Images**: Keep all images as local files inside `vanilla-site/images/` referenced via relative paths (`images/<filename>`). Never inline base64 `data:image` URIs in HTML, CSS, or JS.
4. **Pixel-identical fidelity**: Do not redesign, simplify, or add unrequested features. Keep all text, ES/EN translations, pricing, breakpoints, hover states, and animations identical to the source.
5. **No Lovable host wrapper**: Do not include `#lovable-badge` ("Edit with Lovable") or Lovable analytics scripts (`/__l5e/events...js`).

## Architecture of `vanilla-site/`

### 1. Single-File Hash Routing (`index.html` + `script.js`)
Both routes live inside `vanilla-site/index.html` as top-level views toggled via `hidden`:
- `#page-home`: Shown for `""`, `"#"`, `"#/"`, `"#modelo-de-negocio"`.
- `#page-distribuye`: Shown for `"#/distribuye"`, `"#distribuye"`, `"#paquetes"`, `"#formulario-distribuidor"`, `"#mantenimiento-mensual"`.
- `script.js` updates `document.title`, `<meta name="description">`, and scroll position/anchor scrolling on `hashchange` and initial load.

### 2. Bilingual i18n (`ES` / `EN`)
- Default initial HTML is Spanish (`<html lang="es">`).
- Saved language persists in `localStorage` under key `omc-lang` (`"es"` or `"en"`).
- Both headers contain synced `[data-lang-btn="es"|"en"]` toggles.
- Translatable elements use `data-i18n`, `data-i18n-alt`, `data-i18n-aria`, `data-i18n-placeholder`, and `data-wa-key`, backed by the `I18N` and `WA_MESSAGES` dictionaries in `script.js`.
- Always update both `es` and `en` whenever editing copy.

### 3. Handwritten CSS & Critical Pixel-Match Details (`style.css`)
- Theme colors use the exact OKLCH palette in `:root` (`--background`, `--foreground`, `--card`, `--primary`, `--caramel`, `--caramel-light`, `--cream`, `--secondary`, `--muted-foreground`, `--destructive`, `--border`, `--distribution-photo-shade`, and `color-mix(in oklab, ...)` overlays).
- **Important radius quirk from source**: `--radius: 1.25rem` (`20px`), `--radius-lg: 1.25rem`, `--radius-xl: calc(var(--radius) + 4px)` (`24px`), while `--radius-2xl: 1rem` (`16px`). Do not "fix" this—it matches the live site.
- **Constrained Home sections**: Products, Differentiators, and Business Model (`#modelo-de-negocio`) apply `.section--contained-5xl` / `.section--contained-3xl` directly on `<section>` (sharing `padding-inline: 1.25rem` and `max-width` on the same element).
- **Unitless line-height on large pill buttons**: `.btn-pill--lg` uses `line-height: calc(2 / 1.5)` so `.distribution-photo-dark a` (`font-size: 1.25rem` on `<=1023px`) scales identically to Tailwind v4.
- **Price save badges**: `.price-badge` (`font-size: 10px`) intentionally inherits `line-height: 1.5` (no `line-height: normal`).
- **Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, plus `.distribution-photo` rules at `max-width: 767px`, `768px..1023px`, and `min-width: 768px`.
- **Icons**: All Lucide icons are exact inline `<svg>` elements matching the live DOM.

### 4. Interactive Logic (`script.js`)
- **WhatsApp number**: `528110169320` (`https://wa.me/528110169320?text=...`).
- **Product Pricing**: Each of the 3 product cards (`GanoCafé Classic`, `GanoCafé 3 en 1`, `GanoCafé Schokolade`) defaults to `subscribe` (`$25`, `$25`, `$26` USD, Save 50%) and toggles to `oneTime` (`$33`, `$33`, `$34` USD, Save 34%), dynamically updating the card's WhatsApp order `href` in the active language.
- **Product Carousels**: Horizontal `scroll-snap-type: x mandatory` tracks update active dots (`[data-carousel-dot]`) on scroll and hide the `"Desliza →"` / `"Swipe →"` badge on slide 2.
- **Plantation Video**: Clicking the thumbnail or `"Ver el video"` / `"Watch the video"` replaces the poster with `https://www.youtube-nocookie.com/embed/6Y15eqJ37O8?autoplay=1&rel=0`, hides the CTA button, and applies `.is-playing` (`padding-block: 1.25rem`) to the caption box.
- **Distributor Lead Form (`#distributor-form`)**: Validates non-empty `nombre`, `whatsapp`, and email regex, then sends a direct `POST` to:
  - Endpoint: `https://c--af87f8fb-6032-48f3-b72d-5368ff4eb306-prod.lovable.cloud/rest/v1/distribuidor_leads`
  - Headers: `Content-Type: application/json`, `apikey: sb_publishable_ca0lA7ZalL1C81wKBOUttw_0ikqkojK`, `Prefer: return=minimal` (note: opaque `sb_publishable_` key is sent only in `apikey`, never as `Authorization: Bearer`).
  - On success, swaps the form for `#distributor-form-thanks` showing `¡Gracias, <firstName>!` / `Thank you, <firstName>!`.

### 5. Local Images Inventory (`vanilla-site/images/`)
- Copied from `bilingual-ganoderma-coffee/src/assets/`: `hero-productos.jpg`, `plantacion-ganoderma.jpg`, `classic-frio.jpg`, `3en1-frio.jpg`, `schokolade-frio.jpg`, `distribuir-habito-cafe.jpg`, `distribuir-cafe-bienestar.jpg`, `distribuir-negocio-casa.jpg`.
- Downloaded from live site (`.asset.json` entries in source): `ganoderma-beneficios.jpg`, `ganocafe-classic.jpg`, `ganocafe-3en1.jpg`, `ganocafe-schokolade.jpg`.
- Copied from `bilingual-ganoderma-coffee/public/`: `favicon.ico`.

## Environment & Verification Status

- **Available local tools**: Node.js `v22.14.0` (built-in `fetch` + `WebSocket`), Microsoft Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), `curl.exe`. Python is not installed.
- **Last verified state**: Compared local `vanilla-site/` against `https://subroto-coffee.lovable.app` and `/distribuye` via headless Edge CDP across `375px`, `768px`, and `1280px` in both `ES` and `EN` (12 combinations total): **0px height/width difference, 0 text diffs, 0 style diffs, 0 broken images**, and all interactive checks passing.
- **Testing caution**: Do not submit fake leads to the live Supabase `distribuidor_leads` endpoint; test only client-side validation or mock network requests when verifying the form.
