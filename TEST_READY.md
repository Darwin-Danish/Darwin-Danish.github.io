# TEST READY: Darwin Danish Portfolio Migration E2E Suite

**Test Suite Version**: 1.0.0  
**Test Runner**: `scripts/e2e-test.mjs` (Node.js ESM)  
**Execution Environment**: Node.js 18+ (zero external dependencies required)  
**Target Build Artifacts**: `dist/` (Astro 5 static generation output) and repository filesystem  
**Status**: Ready for Automated E2E & Milestone Verification

---

## 1. Quick Start / Test Runner Commands

Run the full opaque-box E2E test suite from the repository root:

```bash
# Run all 118 tests across Tiers 1–4
node scripts/e2e-test.mjs

# Run summary report only
node scripts/e2e-test.mjs --summary

# Run tests for a specific Tier (1, 2, 3, or 4)
node scripts/e2e-test.mjs --tier=1
node scripts/e2e-test.mjs --tier=2
node scripts/e2e-test.mjs --tier=3
node scripts/e2e-test.mjs --tier=4

# Run tests for a specific Feature area (e.g., F4 Decap CMS, F5 Netlify Identity, F7 Secrets)
node scripts/e2e-test.mjs --feature=F4
node scripts/e2e-test.mjs --feature=F5
node scripts/e2e-test.mjs --feature=F7

# Progressive milestone verification (exit code 0 even if pending milestones have open checks)
node scripts/e2e-test.mjs --allow-fail
```

---

## 2. Test Architecture & Coverage Matrix

The suite implements requirement-driven, opaque-box testing against the acceptance criteria defined in `ORIGINAL_REQUEST.md`, `TEST_INFRA.md`, and `PROJECT.md`.

| Tier | Category | Scope & Methodology | Minimum Target | Actual Checks | Current Status |
|:---:|:---|:---|:---:|:---:|:---:|
| **Tier 1** | Feature Coverage | Primary behavior & happy path for all 10 feature areas | ≥50 | **52** | 30 PASS / 22 PENDING (M2–M5) |
| **Tier 2** | Boundary & Corner Cases | Boundary value analysis, malformed routes, empty collections, security rules | ≥50 | **50** | 27 PASS / 23 PENDING (M2–M5) |
| **Tier 3** | Cross-Feature Interactions | Pairwise validation (Routes ↔ Assets, SEO ↔ Canonical, Sitemap ↔ Routes, CMS ↔ Routing) | ≥10 | **11** | 4 PASS / 7 PENDING (M2–M5) |
| **Tier 4** | Real-World Scenarios | End-to-end user journeys, crawler simulation, security audit, social share simulation | ≥5 | **5** | 0 PASS / 5 PENDING (M2–M5) |
| **TOTAL** | **Full E2E Suite** | **Comprehensive Opaque-Box Validation** | **≥115** | **118** | **61 PASS / 57 PENDING** |

---

## 3. Ten Feature Areas Covered

### Feature 1: Static Build Generation
- `dist/` directory emission and static structure
- `dist/index.html` file size (>500 bytes) and valid HTML5 doctype/tags
- Static CSS/JS asset emission into `dist/_astro/`
- Zero Netlify serverless entrypoints (`entry.mjs`, `.netlify/functions-internal`)

### Feature 2: Route HTML Generation
- Static route existence: `/` (`dist/index.html`), `/about` (`dist/about/index.html`), `/work` (`dist/work/index.html`), `/blog` (`dist/blog/index.html`), `/authors/...` (`dist/authors/darwindanish/index.html`), `/tags` (`dist/tags/index.html`)
- Native GitHub Pages 404 fallback page: `dist/404.html`

### Feature 3: Asset Resolution
- JetBrains Mono fonts preserved on disk (`public/fonts/JetBrainsMono[wght].woff2`)
- Bento SVG & PNG graphics preserved (`bento-discord-futon.svg`, `about-background.png`, `github-foreground.png`, etc.)
- Favicons & Web App Manifest preserved (`favicon.svg`, `site.webmanifest`)
- Preserved uploads directory (`public/uploads/`)
- Root-relative image paths and resolution check

### Feature 4: Decap CMS Complete Removal
- Complete deletion of admin routes: `src/pages/admin/`
- Complete deletion of admin public assets: `public/admin/`
- Complete deletion of OAuth bridge API endpoints: `src/pages/api/` (`auth/index.ts`, `callback/index.ts`)
- Complete deletion of documentation: `CMS_SETUP.md`
- Complete removal of `decap-server` devDependency and `"cms:local"` script from `package.json`
- Zero admin directory emission in static output (`dist/admin/`)

### Feature 5: Netlify Identity & Script Elimination
- Zero external `identity.netlify.com` script tags in HTML head across all generated pages (`dist/index.html`, `dist/about/index.html`, `dist/blog/index.html`, `dist/work/index.html`, `dist/404.html`)
- Zero inline redirect handlers (`document.location.href = '/admin/'`) in `src/components/Head.astro` or emitted HTML

### Feature 6: Blog & Works Tabs Empty & Card Fallbacks
- Graceful rendering of `/blog/` and `/work/` pages when content collections are empty
- Preservation of semantic `<main>` element and layout headers
- Astro 5 Content Collections schemas defined in `src/content.config.ts` using `defineCollection` and `glob` loader
- No broken `href="undefined"` or `NaN` pagination links

### Feature 7: Secret & Credential Safe Exclusion
- Git index audit: `.env` and `.env.local` are 100% untracked (`git ls-files` returns empty)
- Git history audit: zero committed `.env` files in git log
- Git ignore audit: `.gitignore` rules enforced via `git check-ignore`
- Client bundle scan: zero leaked TinaCMS tokens, JWT HMAC secrets, or Vercel OIDC bearer tokens in `dist/`

### Feature 8: AI Trace & Watermark Elimination
- Absence of stock watermarked asset: `public/uploads/ai-assistant-star-icon-vector-600nw-2672868661.jpg.webp`
- Absence of conversational AI prompt closing in documentation (`"If you want, tell me where you deploy..."`)
- Absence of stray untracked screenshot dumps in repo root (`Panel image.png`, `image copy.png`, etc.)
- Clean template constants in `DiscordPresence.tsx` (no dummy `YOUR_DISCORD_USER_ID`) and `WakatimeGraph.tsx` (no `@jktrn` URL)

### Feature 9: SEO Canonical URLs & Meta Tags
- Canonical URL in `dist/index.html` points to `https://darwindanish.github.io` (zero references to expired `darwindanish.dev`)
- Canonical URLs on inner pages point to GitHub Pages routes (`/about/`, `/work/`, `/authors/darwindanish/`)
- Open Graph metadata and title reference "Darwin Danish"
- Meta description tag present and non-empty
- Unblocking indexing: `dist/authors/darwindanish/index.html` does NOT contain `noindex`

### Feature 10: Sitemap & Robots.txt Compliance
- `dist/robots.txt` exists, specifies `User-agent: *`, `Allow: /`, and `Sitemap: https://darwindanish.github.io/sitemap-index.xml`
- `dist/sitemap-index.xml` or `dist/sitemap-0.xml` is valid XML syntax
- Sitemap canonical URLs point to `https://darwindanish.github.io`
- Sitemap excludes binary image assets and `site.webmanifest` from indexable page list

---

## 4. Milestone Traceability Matrix

| Milestone | Key Verification Focus | Test Checks Exercised | Expected Result Post-Milestone |
|---|---|---|:---:|
| **M1: Decap CMS Removal** | Admin routes, API routes, `decap-server`, Netlify Identity script | `T1.F4.*`, `T1.F5.*`, `T2.B4.*`, `T2.B5.*`, `T3.P7`, `T3.P8` | **100% PASS** (Currently Verified) |
| **M2: Static Astro Build** | Static build execution, `dist/index.html`, canonical domain | `T1.F1.*`, `T1.F2.1`, `T1.F9.1`, `T2.B1.*`, `T3.P2` | 100% PASS after M2 |
| **M3: Routing & 404** | Inner routes (`/about`, `/work`, `/blog`), `dist/404.html`, bento paths | `T1.F2.*`, `T1.F6.*`, `T2.B2.*`, `T2.B3.5`, `T3.P1`, `T4.S1`, `T4.S2` | 100% PASS after M3 |
| **M4: Hygiene & Secrets** | `.gitignore` hardening (`.agents/`, `.qodo/`), watermark deletion, placeholders | `T1.F7.*`, `T1.F8.*`, `T2.B7.*`, `T2.B8.*`, `T3.P9`, `T3.P10`, `T4.S4` | 100% PASS after M4 |
| **M5: SEO & Sitemap** | robots.txt, sitemap XML, author indexing, OG tags, title tags | `T1.F9.*`, `T1.F10.*`, `T2.B9.*`, `T2.B10.*`, `T3.P5`, `T3.P6`, `T3.P11`, `T4.S3`, `T4.S5` | 100% PASS after M5 |
| **M6: Full E2E & Hardening** | Complete runner pass across all 118 checks with exit code 0 | All checks (118/118) | **100% PASS (118/118)** |

---

## 5. Independent Verification Command

To independently verify the test suite execution:

```bash
cd /Users/castiel/Documents/github/darwindanish
node scripts/e2e-test.mjs --allow-fail
```
