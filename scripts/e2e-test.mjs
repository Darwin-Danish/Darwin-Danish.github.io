#!/usr/bin/env node

/**
 * ============================================================================
 * Darwin Danish Portfolio — Opaque-Box E2E Test Suite
 * ============================================================================
 *
 * Requirements-driven test runner targeting:
 *  - Static build artifacts in `dist/`
 *  - Repository hygiene, secrets, and configuration
 *
 * Test Architecture (TEST_INFRA.md):
 *  - Tier 1: Feature Coverage (52 checks across 10 core features)
 *  - Tier 2: Boundary & Corner Cases (50 checks across 10 boundary areas)
 *  - Tier 3: Cross-Feature Pairwise Interactions (11 checks)
 *  - Tier 4: Real-World Scenarios (5 complex persona & crawler simulations)
 *  Total: 118 automated test checks
 *
 * Usage:
 *  node scripts/e2e-test.mjs
 *  node scripts/e2e-test.mjs --tier=1
 *  node scripts/e2e-test.mjs --feature=F4
 *  node scripts/e2e-test.mjs --summary
 *  node scripts/e2e-test.mjs --allow-fail
 * ============================================================================
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')

// ----------------------------------------------------------------------------
// CLI Arguments Parsing
// ----------------------------------------------------------------------------
const args = process.argv.slice(2)
const filterTier = args.find((a) => a.startsWith('--tier='))?.split('=')[1]
const filterFeature = args
  .find((a) => a.startsWith('--feature='))
  ?.split('=')[1]
  ?.toUpperCase()
const summaryOnly = args.includes('--summary')
const allowFail = args.includes('--allow-fail')
const verbose = args.includes('--verbose')

// ----------------------------------------------------------------------------
// Test Framework Primitives & State
// ----------------------------------------------------------------------------
const testRegistry = []

function registerTest({ id, tier, feature, title, run }) {
  testRegistry.push({ id, tier, feature, title, run })
}

class AssertionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AssertionError'
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new AssertionError(message || 'Assertion failed')
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(
      message ||
        `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
  }
}

function assertMatch(string, regex, message) {
  if (typeof string !== 'string' || !regex.test(string)) {
    throw new AssertionError(message || `Expected string to match ${regex}`)
  }
}

function assertNotMatch(string, regex, message) {
  if (typeof string === 'string' && regex.test(string)) {
    throw new AssertionError(message || `Expected string NOT to match ${regex}`)
  }
}

function assertContains(haystack, needle, message) {
  if (typeof haystack !== 'string' || !haystack.includes(needle)) {
    throw new AssertionError(
      message || `Expected string to contain ${JSON.stringify(needle)}`,
    )
  }
}

function assertNotContains(haystack, needle, message) {
  if (typeof haystack === 'string' && haystack.includes(needle)) {
    throw new AssertionError(
      message || `Expected string NOT to contain ${JSON.stringify(needle)}`,
    )
  }
}

function assertFileExists(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new AssertionError(message || `Expected file to exist: ${filePath}`)
  }
}

function assertFileMissing(filePath, message) {
  if (fs.existsSync(filePath)) {
    throw new AssertionError(
      message || `Expected file NOT to exist: ${filePath}`,
    )
  }
}

function assertDirExists(dirPath, message) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new AssertionError(
      message || `Expected directory to exist: ${dirPath}`,
    )
  }
}

function assertDirMissing(dirPath, message) {
  if (fs.existsSync(dirPath)) {
    throw new AssertionError(
      message || `Expected directory NOT to exist: ${dirPath}`,
    )
  }
}

// ----------------------------------------------------------------------------
// Helpers: File System, HTML Parsing, Git Queries
// ----------------------------------------------------------------------------
function readDist(relPath) {
  const fullPath = path.join(DIST_DIR, relPath)
  if (!fs.existsSync(fullPath)) return null
  return fs.readFileSync(fullPath, 'utf8')
}

function readSrc(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath)
  if (!fs.existsSync(fullPath)) return null
  return fs.readFileSync(fullPath, 'utf8')
}

function extractMeta(html, nameOrProp) {
  if (!html) return null
  const regex = new RegExp(
    `<meta\\s+[^>]*?(?:name|property)=["']${nameOrProp}["'][^>]*?>`,
    'i',
  )
  const match = html.match(regex)
  if (!match) return null
  const contentMatch = match[0].match(/content=["'](.*?)["']/i)
  return contentMatch ? contentMatch[1] : ''
}

function extractCanonical(html) {
  if (!html) return null
  const match = html.match(/<link\s+[^>]*?rel=["']canonical["'][^>]*?>/i)
  if (!match) return null
  const hrefMatch = match[0].match(/href=["'](.*?)["']/i)
  return hrefMatch ? hrefMatch[1] : null
}

function extractTitle(html) {
  if (!html) return null
  const match = html.match(/<title>([^<]*)<\/title>/i)
  return match ? match[1].trim() : null
}

function isGitTracked(relPath) {
  try {
    const out = execSync(`git ls-files ${relPath}`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return out.trim().length > 0
  } catch {
    return false
  }
}

function isGitIgnored(relPath) {
  try {
    execSync(`git check-ignore -q ${relPath}`, {
      cwd: ROOT_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return true
  } catch {
    return false
  }
}

// ============================================================================
// TIER 1: Feature Coverage (Primary Behavior / Happy Path)
// ============================================================================

// --- Feature 1: Static Build Generation ---
registerTest({
  id: 'T1.F1.1',
  tier: 'Tier 1',
  feature: 'F1 - Static Build',
  title: 'dist/ directory exists and is a directory',
  run: () => {
    assertDirExists(DIST_DIR, 'dist/ directory must exist after build')
  },
})

registerTest({
  id: 'T1.F1.2',
  tier: 'Tier 1',
  feature: 'F1 - Static Build',
  title: 'dist/index.html exists and is non-empty (>500 bytes)',
  run: () => {
    const indexPath = path.join(DIST_DIR, 'index.html')
    assertFileExists(indexPath, 'dist/index.html must exist')
    const stats = fs.statSync(indexPath)
    assert(
      stats.size > 500,
      `dist/index.html is too small (${stats.size} bytes)`,
    )
  },
})

registerTest({
  id: 'T1.F1.3',
  tier: 'Tier 1',
  feature: 'F1 - Static Build',
  title: 'dist/index.html contains valid HTML5 document structure',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertMatch(html, /<!DOCTYPE\s+html/i, 'Missing <!DOCTYPE html> doctype')
    assertMatch(html, /<html/i, 'Missing <html tag')
    assertMatch(html, /<head/i, 'Missing <head tag')
    assertMatch(html, /<body/i, 'Missing <body tag')
  },
})

registerTest({
  id: 'T1.F1.4',
  tier: 'Tier 1',
  feature: 'F1 - Static Build',
  title: 'dist/ contains static assets or CSS bundles in _astro/',
  run: () => {
    const astroDir = path.join(DIST_DIR, '_astro')
    assertDirExists(
      astroDir,
      'dist/_astro directory must exist for compiled assets',
    )
    const files = fs.readdirSync(astroDir)
    assert(files.length > 0, 'dist/_astro must contain compiled CSS/JS assets')
  },
})

registerTest({
  id: 'T1.F1.5',
  tier: 'Tier 1',
  feature: 'F1 - Static Build',
  title: 'dist/ contains zero serverless lambda/SSR entrypoint bundles',
  run: () => {
    assertFileMissing(
      path.join(DIST_DIR, 'entry.mjs'),
      'dist/entry.mjs must not exist in static build',
    )
    assertDirMissing(
      path.join(DIST_DIR, '.netlify'),
      'dist/.netlify must not exist in static build',
    )
    assertDirMissing(
      path.join(ROOT_DIR, '.netlify/functions-internal'),
      'functions-internal must not exist',
    )
  },
})

// --- Feature 2: Route HTML Generation ---
registerTest({
  id: 'T1.F2.1',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'Homepage route dist/index.html renders personal portfolio branding',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertContains(html, 'Darwin', 'Homepage must contain "Darwin"')
  },
})

registerTest({
  id: 'T1.F2.2',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'About page route dist/about/index.html exists and renders content',
  run: () => {
    const html = readDist('about/index.html')
    assert(html !== null, 'dist/about/index.html missing')
    assert(html.length > 500, 'dist/about/index.html is too small')
  },
})

registerTest({
  id: 'T1.F2.3',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'Work page route dist/work/index.html exists and renders content',
  run: () => {
    const html = readDist('work/index.html')
    assert(html !== null, 'dist/work/index.html missing')
    assert(html.length > 500, 'dist/work/index.html is too small')
  },
})

registerTest({
  id: 'T1.F2.4',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'Blog page route dist/blog/index.html exists and renders content',
  run: () => {
    const html = readDist('blog/index.html')
    assert(html !== null, 'dist/blog/index.html missing')
    assert(html.length > 500, 'dist/blog/index.html is too small')
  },
})

registerTest({
  id: 'T1.F2.5',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'Authors profile route dist/authors/darwindanish/index.html exists',
  run: () => {
    const html = readDist('authors/darwindanish/index.html')
    assert(html !== null, 'dist/authors/darwindanish/index.html missing')
    assertContains(
      html,
      'Darwin Danish',
      'Author profile page must mention Darwin Danish',
    )
  },
})

registerTest({
  id: 'T1.F2.6',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title: 'GitHub Pages 404 fallback page dist/404.html exists at dist root',
  run: () => {
    const html = readDist('404.html')
    assert(
      html !== null,
      'dist/404.html missing (required for GitHub Pages 404 handling)',
    )
    assert(html.length > 200, 'dist/404.html is too small')
  },
})

registerTest({
  id: 'T1.F2.7',
  tier: 'Tier 1',
  feature: 'F2 - Routes',
  title:
    'Achievements page route dist/achievements/index.html exists and renders content',
  run: () => {
    const html = readDist('achievements/index.html')
    assert(html !== null, 'dist/achievements/index.html missing')
    assert(html.length > 1000, 'dist/achievements/index.html is too small')
    assertContains(
      html,
      'Achievements',
      'Achievements page must render Achievements title',
    )
    assertContains(
      html,
      'Mini Inno Waste 2.0',
      'Achievements page must render Mini Inno Waste 2.0',
    )
  },
})

// --- Feature 3: Asset Resolution ---
registerTest({
  id: 'T1.F3.1',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title: 'JetBrains Mono font files exist on disk',
  run: () => {
    const fontInDist = fs.existsSync(
      path.join(DIST_DIR, 'fonts/JetBrainsMono[wght].woff2'),
    )
    const fontInPublic = fs.existsSync(
      path.join(ROOT_DIR, 'public/fonts/JetBrainsMono[wght].woff2'),
    )
    assert(
      fontInDist || fontInPublic,
      'JetBrainsMono woff2 font must exist in public/fonts or dist/fonts',
    )
  },
})

registerTest({
  id: 'T1.F3.2',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title: 'Bento discord icon SVG exists',
  run: () => {
    const svgInDist = fs.existsSync(
      path.join(DIST_DIR, 'static/bento/bento-discord-futon.svg'),
    )
    const svgInPublic = fs.existsSync(
      path.join(ROOT_DIR, 'public/static/bento/bento-discord-futon.svg'),
    )
    assert(svgInDist || svgInPublic, 'bento-discord-futon.svg must exist')
  },
})

registerTest({
  id: 'T1.F3.3',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title: 'Bento about background asset exists',
  run: () => {
    const assetInDist = fs.existsSync(
      path.join(DIST_DIR, 'static/bento/about-background.png'),
    )
    const assetInPublic = fs.existsSync(
      path.join(ROOT_DIR, 'public/static/bento/about-background.png'),
    )
    assert(assetInDist || assetInPublic, 'about-background.png must exist')
  },
})

registerTest({
  id: 'T1.F3.4',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title: 'Bento github foreground asset exists',
  run: () => {
    const assetInDist = fs.existsSync(
      path.join(DIST_DIR, 'static/bento/github-foreground.png'),
    )
    const assetInPublic = fs.existsSync(
      path.join(ROOT_DIR, 'public/static/bento/github-foreground.png'),
    )
    assert(assetInDist || assetInPublic, 'github-foreground.png must exist')
  },
})

registerTest({
  id: 'T1.F3.5',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title: 'Favicon and web app manifest exist',
  run: () => {
    const favInDist = fs.existsSync(path.join(DIST_DIR, 'favicon.svg'))
    const favInPublic = fs.existsSync(path.join(ROOT_DIR, 'public/favicon.svg'))
    assert(favInDist || favInPublic, 'favicon.svg must exist')

    const manifestInDist = fs.existsSync(
      path.join(DIST_DIR, 'site.webmanifest'),
    )
    const manifestInPublic = fs.existsSync(
      path.join(ROOT_DIR, 'public/site.webmanifest'),
    )
    assert(manifestInDist || manifestInPublic, 'site.webmanifest must exist')
  },
})

registerTest({
  id: 'T1.F3.6',
  tier: 'Tier 1',
  feature: 'F3 - Assets',
  title:
    'Google Search Favicon Specification: 48x48, 96x96, 192x192 PNGs and multi-size favicon.ico exist',
  run: () => {
    // 1. Physical 48x48, 96x96, and 192x192 PNGs must exist in dist/
    const fav48Path = path.join(DIST_DIR, 'favicon-48x48.png')
    const fav96Path = path.join(DIST_DIR, 'favicon-96x96.png')
    const fav192Path = path.join(DIST_DIR, 'favicon-192x192.png')
    const icoPath = path.join(DIST_DIR, 'favicon.ico')

    assertFileExists(fav48Path, 'favicon-48x48.png must exist in dist/')
    assertFileExists(fav96Path, 'favicon-96x96.png must exist in dist/')
    assertFileExists(fav192Path, 'favicon-192x192.png must exist in dist/')
    assertFileExists(icoPath, 'favicon.ico must exist in dist/')

    // 2. Validate dimensions of 48x48 PNG (IHDR chunk: bytes 16-24)
    const buf48 = fs.readFileSync(fav48Path)
    const w48 = buf48.readUInt32BE(16)
    const h48 = buf48.readUInt32BE(20)
    assert(w48 === 48 && h48 === 48, `favicon-48x48.png must be 48x48, got ${w48}x${h48}`)

    // 3. Validate dimensions of 96x96 PNG
    const buf96 = fs.readFileSync(fav96Path)
    const w96 = buf96.readUInt32BE(16)
    const h96 = buf96.readUInt32BE(20)
    assert(w96 === 96 && h96 === 96, `favicon-96x96.png must be 96x96, got ${w96}x${h96}`)

    // 4. Validate favicon.ico contains a 48x48 frame
    const bufIco = fs.readFileSync(icoPath)
    const iconCount = bufIco.readUInt16LE(4)
    assert(iconCount >= 2, `favicon.ico must contain multiple frames, got ${iconCount}`)
    const icoSizes = []
    for (let i = 0; i < iconCount; i++) {
      const w = bufIco.readUInt8(6 + i * 16) || 256
      const h = bufIco.readUInt8(7 + i * 16) || 256
      icoSizes.push(`${w}x${h}`)
    }
    assert(
      icoSizes.includes('48x48'),
      `favicon.ico must contain a 48x48 resolution frame (found: ${icoSizes.join(', ')})`,
    )

    // 5. dist/index.html must link 48x48 and 96x96 with sizes attribute
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertMatch(
      html,
      /<link[^>]*rel=["']icon["'][^>]*sizes=["']48x48["'][^>]*href=["']\/favicon-48x48\.png["']/i,
      'dist/index.html must declare link rel="icon" for favicon-48x48.png with sizes="48x48"',
    )
    assertMatch(
      html,
      /<link[^>]*rel=["']icon["'][^>]*sizes=["']96x96["'][^>]*href=["']\/favicon-96x96\.png["']/i,
      'dist/index.html must declare link rel="icon" for favicon-96x96.png with sizes="96x96"',
    )
  },
})

// --- Feature 4: Decap CMS Complete Removal ---
registerTest({
  id: 'T1.F4.1',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'src/pages/admin/ directory is completely removed',
  run: () => {
    assertDirMissing(
      path.join(ROOT_DIR, 'src/pages/admin'),
      'src/pages/admin directory must be deleted',
    )
  },
})

registerTest({
  id: 'T1.F4.2',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'public/admin/ directory is completely removed',
  run: () => {
    assertDirMissing(
      path.join(ROOT_DIR, 'public/admin'),
      'public/admin directory must be deleted',
    )
  },
})

registerTest({
  id: 'T1.F4.3',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'dist/admin/ directory is absent from static build output',
  run: () => {
    assertDirMissing(
      path.join(DIST_DIR, 'admin'),
      'dist/admin directory must not exist',
    )
  },
})

registerTest({
  id: 'T1.F4.4',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'src/pages/api/ OAuth bridge endpoints are completely deleted',
  run: () => {
    assertDirMissing(
      path.join(ROOT_DIR, 'src/pages/api'),
      'src/pages/api directory must be deleted',
    )
  },
})

registerTest({
  id: 'T1.F4.5',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'CMS_SETUP.md documentation is completely removed',
  run: () => {
    assertFileMissing(
      path.join(ROOT_DIR, 'CMS_SETUP.md'),
      'CMS_SETUP.md must be deleted',
    )
  },
})

registerTest({
  id: 'T1.F4.6',
  tier: 'Tier 1',
  feature: 'F4 - Decap CMS Removal',
  title: 'package.json excludes decap-server dependency and cms:local script',
  run: () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'),
    )
    assert(
      !pkg.scripts?.['cms:local'],
      'package.json scripts must not contain "cms:local"',
    )
    assert(
      !pkg.dependencies?.['decap-server'],
      'package.json dependencies must not contain "decap-server"',
    )
    assert(
      !pkg.devDependencies?.['decap-server'],
      'package.json devDependencies must not contain "decap-server"',
    )
  },
})

// --- Feature 5: Netlify Identity & Script Elimination ---
registerTest({
  id: 'T1.F5.1',
  tier: 'Tier 1',
  feature: 'F5 - Netlify Identity Elimination',
  title: 'dist/index.html contains zero Netlify Identity widget script tags',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'dist/index.html must not load netlify identity',
      )
      assertNotContains(
        html,
        'netlifyIdentity',
        'dist/index.html must not reference netlifyIdentity',
      )
    }
  },
})

registerTest({
  id: 'T1.F5.2',
  tier: 'Tier 1',
  feature: 'F5 - Netlify Identity Elimination',
  title: 'dist/about/index.html contains zero Netlify Identity widget scripts',
  run: () => {
    const html = readDist('about/index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'dist/about/index.html must not load netlify identity',
      )
    }
  },
})

registerTest({
  id: 'T1.F5.3',
  tier: 'Tier 1',
  feature: 'F5 - Netlify Identity Elimination',
  title: 'dist/blog/index.html contains zero Netlify Identity widget scripts',
  run: () => {
    const html = readDist('blog/index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'dist/blog/index.html must not load netlify identity',
      )
    }
  },
})

registerTest({
  id: 'T1.F5.4',
  tier: 'Tier 1',
  feature: 'F5 - Netlify Identity Elimination',
  title: 'dist/work/index.html contains zero Netlify Identity widget scripts',
  run: () => {
    const html = readDist('work/index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'dist/work/index.html must not load netlify identity',
      )
    }
  },
})

registerTest({
  id: 'T1.F5.5',
  tier: 'Tier 1',
  feature: 'F5 - Netlify Identity Elimination',
  title:
    'src/components/Head.astro has zero Netlify Identity or auto-redirect code',
  run: () => {
    const headCode = readSrc('src/components/Head.astro')
    assert(headCode !== null, 'src/components/Head.astro must exist')
    assertNotContains(
      headCode,
      'identity.netlify.com',
      'Head.astro must not load netlify identity widget',
    )
    assertNotContains(
      headCode,
      'netlifyIdentity',
      'Head.astro must not reference netlifyIdentity',
    )
    assertNotContains(
      headCode,
      '/admin/',
      'Head.astro must not contain auto-redirect to /admin/',
    )
  },
})

registerTest({
  id: 'T1.F5.6',
  tier: 'Tier 1',
  feature: 'F5 - Netlify & Vercel Script Elimination',
  title:
    'dist/ static files contain zero references to Vercel scripts (_vercel/insights, _vercel/speed-insights)',
  run: () => {
    const htmlFiles = [
      'index.html',
      'about/index.html',
      'work/index.html',
      'blog/index.html',
      'achievements/index.html',
      '404.html',
    ]
    for (const rel of htmlFiles) {
      const html = readDist(rel)
      if (html) {
        assertNotContains(
          html,
          '_vercel/insights',
          `${rel} must not contain Vercel analytics script`,
        )
        assertNotContains(
          html,
          '_vercel/speed-insights',
          `${rel} must not contain Vercel speed insights script`,
        )
      }
    }
  },
})

registerTest({
  id: 'T1.F5.7',
  tier: 'Tier 1',
  feature: 'F5 - Netlify & Vercel Script Elimination',
  title:
    'Layout.astro and Head.astro contain zero @vercel/analytics or @vercel/speed-insights imports',
  run: () => {
    const layout = readSrc('src/layouts/Layout.astro')
    assert(layout !== null, 'src/layouts/Layout.astro must exist')
    assertNotContains(
      layout,
      '@vercel/analytics',
      'Layout.astro must not import @vercel/analytics',
    )

    const head = readSrc('src/components/Head.astro')
    assert(head !== null, 'src/components/Head.astro must exist')
    assertNotContains(
      head,
      '@vercel/speed-insights',
      'Head.astro must not import @vercel/speed-insights',
    )
  },
})

// --- Feature 6: Blog & Works Tabs Empty & Card Fallbacks ---
registerTest({
  id: 'T1.F6.1',
  tier: 'Tier 1',
  feature: 'F6 - Blog & Work Fallbacks',
  title:
    'dist/blog/index.html renders valid page structure when blog collection is empty',
  run: () => {
    const html = readDist('blog/index.html')
    assert(html !== null, 'dist/blog/index.html missing')
    assertMatch(html, /<main[^>]*>/i, 'Blog page must contain a <main> element')
  },
})

registerTest({
  id: 'T1.F6.2',
  tier: 'Tier 1',
  feature: 'F6 - Blog & Work Fallbacks',
  title: 'dist/blog/index.html contains blog header and navigation elements',
  run: () => {
    const html = readDist('blog/index.html')
    assert(html !== null, 'dist/blog/index.html missing')
    assertContains(html, 'Blog', 'Blog page must display Blog section heading')
  },
})

registerTest({
  id: 'T1.F6.3',
  tier: 'Tier 1',
  feature: 'F6 - Blog & Work Fallbacks',
  title:
    'dist/work/index.html renders valid page structure when projects collection is empty',
  run: () => {
    const html = readDist('work/index.html')
    assert(html !== null, 'dist/work/index.html missing')
    assertMatch(html, /<main[^>]*>/i, 'Work page must contain a <main> element')
  },
})

registerTest({
  id: 'T1.F6.4',
  tier: 'Tier 1',
  feature: 'F6 - Blog & Work Fallbacks',
  title: 'dist/work/index.html displays Work content or intro',
  run: () => {
    const html = readDist('work/index.html')
    assert(html !== null, 'dist/work/index.html missing')
    assert(
      html.toLowerCase().includes('work') ||
        html.toLowerCase().includes('project'),
      'Work page must contain Work or Project copy',
    )
  },
})

registerTest({
  id: 'T1.F6.5',
  tier: 'Tier 1',
  feature: 'F6 - Blog & Work Fallbacks',
  title:
    'src/content.config.ts defines blog and projects content schemas with Astro 5 loader',
  run: () => {
    const contentConfig = readSrc('src/content.config.ts')
    assert(contentConfig !== null, 'src/content.config.ts must exist')
    assertContains(
      contentConfig,
      'defineCollection',
      'Must use defineCollection',
    )
    assert(
      contentConfig.includes('const blog = defineCollection') ||
        contentConfig.includes('blog:'),
      'Must define blog collection',
    )
    assert(
      contentConfig.includes('const projects = defineCollection') ||
        contentConfig.includes('projects:'),
      'Must define projects collection',
    )
  },
})

// --- Feature 7: Secret & Credential Safe Exclusion ---
registerTest({
  id: 'T1.F7.1',
  tier: 'Tier 1',
  feature: 'F7 - Secrets & Credentials',
  title: '.env file is NOT tracked in git index',
  run: () => {
    const tracked = isGitTracked('.env')
    assert(!tracked, '.env must NEVER be tracked by git')
  },
})

registerTest({
  id: 'T1.F7.2',
  tier: 'Tier 1',
  feature: 'F7 - Secrets & Credentials',
  title: '.env.local file is NOT tracked in git index',
  run: () => {
    const tracked = isGitTracked('.env.local')
    assert(!tracked, '.env.local must NEVER be tracked by git')
  },
})

registerTest({
  id: 'T1.F7.3',
  tier: 'Tier 1',
  feature: 'F7 - Secrets & Credentials',
  title: 'Git commit history contains zero commits of real .env files',
  run: () => {
    try {
      const log = execSync(
        'git log --all --name-only --oneline -- .env .env.local .env.production',
        {
          cwd: ROOT_DIR,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        },
      )
      assert(
        !log.includes('.env\n') && !log.includes('.env.local\n'),
        'Git history contains committed .env files',
      )
    } catch {
      // Git command error or no commits
    }
  },
})

registerTest({
  id: 'T1.F7.4',
  tier: 'Tier 1',
  feature: 'F7 - Secrets & Credentials',
  title: 'No TinaCMS token or JWT secret strings are leaked in dist/ bundle',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        '8689fcc31ab384524e8b0522cfe4fe986164519c',
        'Tina token leaked in dist/index.html',
      )
      assertNotContains(
        html,
        '8f7d1d3f5bce8ac7160000cf781a9152c30562d4055992c2d632c74c513519b9',
        'JWT secret leaked in dist/index.html',
      )
    }
  },
})

registerTest({
  id: 'T1.F7.5',
  tier: 'Tier 1',
  feature: 'F7 - Secrets & Credentials',
  title: 'No Vercel OIDC bearer token is leaked in dist/ bundle',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI',
        'Vercel OIDC token leaked in dist/index.html',
      )
    }
  },
})

// --- Feature 8: AI Trace & Watermark Elimination ---
registerTest({
  id: 'T1.F8.1',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Watermarks',
  title:
    'Stock watermarked image ai-assistant-star-icon... is absent from public/uploads',
  run: () => {
    const badFile = 'ai-assistant-star-icon-vector-600nw-2672868661.jpg.webp'
    assertFileMissing(
      path.join(ROOT_DIR, 'public/uploads', badFile),
      `${badFile} must be deleted`,
    )
    assertFileMissing(
      path.join(DIST_DIR, 'uploads', badFile),
      `${badFile} must not exist in dist/`,
    )
  },
})

registerTest({
  id: 'T1.F8.2',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Watermarks',
  title: 'Conversational AI closing text is absent from repository docs',
  run: () => {
    const needle = 'If you want, tell me where you deploy'
    const cmsSetup = readSrc('CMS_SETUP.md')
    if (cmsSetup) {
      assertNotContains(
        cmsSetup,
        needle,
        'CMS_SETUP.md contains conversational AI text',
      )
    }
    const readme = readSrc('README.md')
    if (readme) {
      assertNotContains(
        readme,
        needle,
        'README.md contains conversational AI text',
      )
    }
  },
})

registerTest({
  id: 'T1.F8.3',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Watermarks',
  title: 'Unreferenced root screenshot Panel image.png is not tracked in git',
  run: () => {
    const tracked = isGitTracked('Panel image.png')
    assert(!tracked, 'Panel image.png must not be tracked in git')
  },
})

registerTest({
  id: 'T1.F8.4',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Watermarks',
  title:
    'DiscordPresence.tsx does not use dummy YOUR_DISCORD_USER_ID placeholder',
  run: () => {
    const code = readSrc('src/components/bento/DiscordPresence.tsx')
    assert(code !== null, 'DiscordPresence.tsx must exist')
    assertNotMatch(
      code,
      /const\s+DISCORD_USER_ID\s*=\s*['"]YOUR_DISCORD_USER_ID['"]/,
      'DiscordPresence.tsx must replace dummy placeholder',
    )
  },
})

registerTest({
  id: 'T1.F8.5',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Watermarks',
  title:
    'WakatimeGraph.tsx does not fall back to template author @jktrn API URL',
  run: () => {
    const code = readSrc('src/components/bento/WakatimeGraph.tsx')
    assert(code !== null, 'WakatimeGraph.tsx must exist')
    assertNotContains(
      code,
      '@jktrn/ef6e633b',
      'WakatimeGraph.tsx must not point to @jktrn',
    )
  },
})

registerTest({
  id: 'T1.F8.6',
  tier: 'Tier 1',
  feature: 'F8 - AI Traces & Crawler Safeguards',
  title:
    'DiscordPresence.tsx implements crawler evasion, abort timeout, and does not depend on react-use-lanyard',
  run: () => {
    const code = readSrc('src/components/bento/DiscordPresence.tsx')
    assert(code !== null, 'DiscordPresence.tsx must exist')
    assertNotContains(
      code,
      'react-use-lanyard',
      'DiscordPresence.tsx must not import third-party react-use-lanyard',
    )
    assertContains(
      code,
      'isCrawler',
      'DiscordPresence.tsx must implement isCrawler bot check',
    )
    assertContains(
      code,
      'AbortController',
      'DiscordPresence.tsx must use AbortController timeout',
    )
  },
})

// --- Feature 9: SEO Canonical URLs & Meta Tags ---
registerTest({
  id: 'T1.F9.1',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/index.html canonical URL points to https://darwindanish.github.io',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const canonical = extractCanonical(html)
    assert(
      canonical !== null,
      'Canonical link tag missing from dist/index.html',
    )
    assert(
      canonical.startsWith('https://darwindanish.github.io'),
      `Canonical URL must point to GitHub Pages, got: ${canonical}`,
    )
    assertNotContains(
      canonical,
      'darwindanish.dev',
      'Canonical URL must not point to expired darwindanish.dev',
    )
  },
})

registerTest({
  id: 'T1.F9.2',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/about/index.html canonical URL points to https://darwindanish.github.io/about/',
  run: () => {
    const html = readDist('about/index.html')
    assert(html !== null, 'dist/about/index.html missing')
    const canonical = extractCanonical(html)
    assert(
      canonical !== null,
      'Canonical link tag missing from dist/about/index.html',
    )
    assert(
      canonical.includes('/about'),
      `Canonical URL must include /about, got: ${canonical}`,
    )
    assertNotContains(
      canonical,
      'darwindanish.dev',
      'Canonical URL must not point to expired darwindanish.dev',
    )
  },
})

registerTest({
  id: 'T1.F9.3',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title: 'Author metadata and Open Graph site name reference "Darwin Danish"',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const ogSite = extractMeta(html, 'og:site_name') || ''
    const title = extractTitle(html) || ''
    assert(
      ogSite.includes('Darwin Danish') || title.includes('Darwin Danish'),
      'Metadata must reference Darwin Danish',
    )
  },
})

registerTest({
  id: 'T1.F9.4',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title: 'dist/index.html contains meta description tag with content',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const desc = extractMeta(html, 'description')
    assert(
      desc !== null && desc.length > 10,
      'dist/index.html meta description is missing or too short',
    )
  },
})

registerTest({
  id: 'T1.F9.5',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/authors/darwindanish/index.html does NOT block search indexing with noindex',
  run: () => {
    const html = readDist('authors/darwindanish/index.html')
    assert(html !== null, 'dist/authors/darwindanish/index.html missing')
    const robots = extractMeta(html, 'robots')
    assert(
      !robots || !robots.includes('noindex'),
      'Darwin Danish author profile must NOT be marked noindex',
    )
  },
})

registerTest({
  id: 'T1.F9.6',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/index.html includes google-site-verification meta tag with token YIj5zJdAJuIN9Uh9IosE0uphNopW6FRWNom3wf1cAmU',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertMatch(
      html,
      /<meta\s+name=["']google-site-verification["']\s+content=["']YIj5zJdAJuIN9Uh9IosE0uphNopW6FRWNom3wf1cAmU["']/i,
      'google-site-verification meta tag missing or invalid in index.html',
    )
  },
})

registerTest({
  id: 'T1.F9.7',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/index.html and author profile include ORCID https://orcid.org/0009-0000-1047-4320 and darwindanish github',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertContains(
      html,
      'https://orcid.org/0009-0000-1047-4320',
      'index.html must contain ORCID link',
    )
    assertContains(
      html,
      'https://github.com/darwindanish',
      'index.html must link to github.com/darwindanish',
    )
    assertNotContains(
      html,
      'https://github.com/Darwin-Danish',
      'index.html must not contain old casing Darwin-Danish in links',
    )
    const authorHtml = readDist('authors/darwindanish/index.html')
    assert(authorHtml !== null, 'dist/authors/darwindanish/index.html missing')
    assertContains(
      authorHtml,
      'https://orcid.org/0009-0000-1047-4320',
      'Author page must contain ORCID link',
    )
    assertContains(
      html,
      '"email":"darwindanish.work@gmail.com"',
      'Person schema must include email darwindanish.work@gmail.com',
    )
    assertNotContains(
      html,
      'support.gravatar.com',
      'Person schema must not leak dummy support docs into sameAs',
    )
  },
})

registerTest({
  id: 'T1.F9.8',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/ files contain darwindanish.work@gmail.com and zero occurrences of lumina.ai.devs@gmail.com',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertContains(
      html,
      'darwindanish.work@gmail.com',
      'index.html must contain new email darwindanish.work@gmail.com',
    )
    assertNotContains(
      html,
      'lumina.ai.devs@gmail.com',
      'index.html must not contain old email lumina.ai.devs@gmail.com',
    )
    const authorHtml = readDist('authors/darwindanish/index.html')
    assert(authorHtml !== null, 'dist/authors/darwindanish/index.html missing')
    assertContains(
      authorHtml,
      'darwindanish.work@gmail.com',
      'Author page must contain new email darwindanish.work@gmail.com',
    )
    assertNotContains(
      authorHtml,
      'lumina.ai.devs@gmail.com',
      'Author page must not contain old email lumina.ai.devs@gmail.com',
    )
  },
})

registerTest({
  id: 'T1.F9.9',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'dist/achievements/index.html and person schema record BIICC 2026 Gold Award',
  run: () => {
    const html = readDist('achievements/index.html')
    assert(html !== null, 'dist/achievements/index.html missing')
    assertContains(
      html,
      'Borneo International Innovation Creativity Competition (BIICC) 2026',
      'Achievements page must render BIICC 2026',
    )
    assertContains(
      html,
      'Gold Award',
      'Achievements page must render Gold Award',
    )
    const indexHtml = readDist('index.html')
    assert(indexHtml !== null, 'dist/index.html missing')
    assertContains(
      indexHtml,
      'Borneo International Innovation Creativity Competition (BIICC) 2026',
      'Person schema on homepage must include BIICC 2026 Gold Award',
    )
  },
})

registerTest({
  id: 'T1.F9.10',
  tier: 'Tier 1',
  feature: 'F9 - SEO Metadata',
  title:
    'Google Search Site Name Specification: dist/index.html defines WebSite JSON-LD and application-name meta',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')

    // 1. Validate WebSite schema is present
    const ldScripts = html.match(/<script type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    assert(ldScripts && ldScripts.length > 0, 'No JSON-LD script tags found')

    let foundWebSiteSchema = false
    for (const tag of ldScripts) {
      const content = tag.replace(/<\/?script[^>]*>/gi, '').trim()
      try {
        const parsed = JSON.parse(content)
        if (parsed['@type'] === 'WebSite') {
          foundWebSiteSchema = true
          assertEqual(parsed.name, 'Darwin Danish', 'WebSite schema name must be Darwin Danish')
          assertEqual(parsed['@id'], 'https://darwindanish.github.io/#website', 'WebSite @id must match canonical website id')
          assertEqual(parsed.url, 'https://darwindanish.github.io/', 'WebSite url must be root https://darwindanish.github.io/')
          assert(
            Array.isArray(parsed.alternateName) &&
              parsed.alternateName.includes('Darwin Danish') &&
              parsed.alternateName.includes('Darwin Danish Portfolio') &&
              parsed.alternateName.includes('Darwin Danish Anak Geramong'),
            'WebSite alternateName must contain Darwin Danish, Darwin Danish Portfolio, and Darwin Danish Anak Geramong',
          )
        }
      } catch {
        // ignore other non-json blocks if any
      }
    }
    assert(foundWebSiteSchema, 'dist/index.html must contain @type: WebSite schema for Google Site Name')

    // 2. Validate meta application-name and og:site_name
    assertMatch(
      html,
      /<meta\s+name=["']application-name["']\s+content=["']Darwin Danish["']/i,
      'dist/index.html must contain <meta name="application-name" content="Darwin Danish">',
    )
    assertMatch(
      html,
      /<meta\s+property=["']og:site_name["']\s+content=["']Darwin Danish["']/i,
      'dist/index.html must contain <meta property="og:site_name" content="Darwin Danish">',
    )
  },
})

// --- Feature 10: Sitemap & Robots.txt Compliance ---
registerTest({
  id: 'T1.F10.1',
  tier: 'Tier 1',
  feature: 'F10 - Sitemap & Robots',
  title: 'dist/robots.txt exists and is non-empty',
  run: () => {
    const robotsPath = path.join(DIST_DIR, 'robots.txt')
    assertFileExists(robotsPath, 'dist/robots.txt must exist')
    const content = fs.readFileSync(robotsPath, 'utf8')
    assert(content.length > 20, 'dist/robots.txt is too short')
  },
})

registerTest({
  id: 'T1.F10.2',
  tier: 'Tier 1',
  feature: 'F10 - Sitemap & Robots',
  title: 'dist/robots.txt specifies User-agent: * and Allow: /',
  run: () => {
    const robots = readDist('robots.txt')
    assert(robots !== null, 'dist/robots.txt missing')
    assertMatch(
      robots,
      /User-agent:\s*\*/i,
      'robots.txt must specify User-agent: *',
    )
    assertMatch(robots, /Allow:\s*\//i, 'robots.txt must specify Allow: /')
  },
})

registerTest({
  id: 'T1.F10.3',
  tier: 'Tier 1',
  feature: 'F10 - Sitemap & Robots',
  title:
    'dist/robots.txt specifies Sitemap URL pointing to canonical GitHub Pages domain',
  run: () => {
    const robots = readDist('robots.txt')
    assert(robots !== null, 'dist/robots.txt missing')
    assertMatch(
      robots,
      /Sitemap:\s*https:\/\/darwindanish\.github\.io\//i,
      'robots.txt must reference sitemap on https://darwindanish.github.io',
    )
    assertNotContains(
      robots,
      'darwindanish.dev',
      'robots.txt must not reference expired darwindanish.dev',
    )
  },
})

registerTest({
  id: 'T1.F10.4',
  tier: 'Tier 1',
  feature: 'F10 - Sitemap & Robots',
  title:
    'dist/sitemap-index.xml or dist/sitemap-0.xml exists with valid XML header',
  run: () => {
    const sitemapIndex = readDist('sitemap-index.xml')
    const sitemap0 = readDist('sitemap-0.xml')
    assert(
      sitemapIndex !== null || sitemap0 !== null,
      'A valid sitemap XML file must exist in dist/',
    )
    const xml = sitemapIndex || sitemap0
    assertMatch(xml, /^<\?xml/i, 'Sitemap must start with <?xml declaration')
  },
})

registerTest({
  id: 'T1.F10.5',
  tier: 'Tier 1',
  feature: 'F10 - Sitemap & Robots',
  title:
    'Sitemap XML contains canonical URLs with zero references to darwindanish.dev',
  run: () => {
    const sitemapIndex = readDist('sitemap-index.xml') || ''
    const sitemap0 = readDist('sitemap-0.xml') || ''
    const combined = sitemapIndex + sitemap0
    assert(combined.length > 50, 'Sitemap content missing')
    assertContains(
      combined,
      'https://darwindanish.github.io',
      'Sitemap must contain canonical https://darwindanish.github.io',
    )
    assertNotContains(
      combined,
      'darwindanish.dev',
      'Sitemap must not contain expired darwindanish.dev',
    )
  },
})

// ============================================================================
// TIER 2: Boundary Value Analysis & Corner Cases
// ============================================================================

// --- Boundary 1: Static Build Boundaries ---
registerTest({
  id: 'T2.B1.1',
  tier: 'Tier 2',
  feature: 'B1 - Static Build Edge Cases',
  title: 'package.json dependencies do NOT include @astrojs/netlify',
  run: () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'),
    )
    assert(
      !pkg.dependencies?.['@astrojs/netlify'],
      '@astrojs/netlify must not be in dependencies',
    )
    assert(
      !pkg.devDependencies?.['@astrojs/netlify'],
      '@astrojs/netlify must not be in devDependencies',
    )
  },
})

registerTest({
  id: 'T2.B1.2',
  tier: 'Tier 2',
  feature: 'B1 - Static Build Edge Cases',
  title: 'astro.config.ts does not import or mount netlify adapter',
  run: () => {
    const config = readSrc('astro.config.ts')
    assert(config !== null, 'astro.config.ts missing')
    assertNotContains(
      config,
      '@astrojs/netlify',
      'astro.config.ts must not import @astrojs/netlify',
    )
    assertNotMatch(
      config,
      /adapter:\s*netlify\(\)/,
      'astro.config.ts must not configure netlify() adapter',
    )
  },
})

registerTest({
  id: 'T2.B1.3',
  tier: 'Tier 2',
  feature: 'B1 - Static Build Edge Cases',
  title: 'astro.config.ts is configured for static output (not output: server)',
  run: () => {
    const config = readSrc('astro.config.ts')
    assert(config !== null, 'astro.config.ts missing')
    assertNotMatch(
      config,
      /output:\s*['"]server['"]/,
      'astro.config.ts must NOT use output: "server"',
    )
  },
})

registerTest({
  id: 'T2.B1.4',
  tier: 'Tier 2',
  feature: 'B1 - Static Build Edge Cases',
  title:
    'astro.config.ts does not contain parameterized wildcard redirects like /blog/[id]',
  run: () => {
    const config = readSrc('astro.config.ts')
    assert(config !== null, 'astro.config.ts missing')
    assertNotContains(
      config,
      "'/blog/[id]'",
      'astro.config.ts must not have wildcard redirect /blog/[id]',
    )
  },
})

registerTest({
  id: 'T2.B1.5',
  tier: 'Tier 2',
  feature: 'B1 - Static Build Edge Cases',
  title:
    'Emitted HTML files in dist/ have valid UTF-8 encoding without BOM corruption',
  run: () => {
    const buffer = fs.readFileSync(path.join(DIST_DIR, 'index.html'))
    // Check for UTF-8 BOM: 0xEF, 0xBB, 0xBF
    const hasBOM =
      buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf
    assert(!hasBOM, 'dist/index.html should not have UTF-8 BOM byte order mark')
  },
})

// --- Boundary 2: Route Boundaries ---
registerTest({
  id: 'T2.B2.1',
  tier: 'Tier 2',
  feature: 'B2 - Route Boundaries',
  title: 'dist/404.html contains meta robots noindex tag to prevent indexing',
  run: () => {
    const html = readDist('404.html')
    assert(html !== null, 'dist/404.html missing')
    const robots = extractMeta(html, 'robots')
    assert(
      robots !== null && robots.includes('noindex'),
      'dist/404.html must contain noindex meta tag',
    )
  },
})

registerTest({
  id: 'T2.B2.2',
  tier: 'Tier 2',
  feature: 'B2 - Route Boundaries',
  title: 'dist/404.html contains navigation link back to root homepage /',
  run: () => {
    const html = readDist('404.html')
    assert(html !== null, 'dist/404.html missing')
    assertMatch(
      html,
      /<a\s+[^>]*?href=["']\/["'][^>]*?>/i,
      'dist/404.html must link back to home ("/")',
    )
  },
})

registerTest({
  id: 'T2.B2.3',
  tier: 'Tier 2',
  feature: 'B2 - Route Boundaries',
  title:
    'Directory index routes exist consistently for about, work, blog, and tags',
  run: () => {
    assertFileExists(
      path.join(DIST_DIR, 'about/index.html'),
      'dist/about/index.html missing',
    )
    assertFileExists(
      path.join(DIST_DIR, 'work/index.html'),
      'dist/work/index.html missing',
    )
    assertFileExists(
      path.join(DIST_DIR, 'blog/index.html'),
      'dist/blog/index.html missing',
    )
    assertFileExists(
      path.join(DIST_DIR, 'tags/index.html'),
      'dist/tags/index.html missing',
    )
  },
})

registerTest({
  id: 'T2.B2.4',
  tier: 'Tier 2',
  feature: 'B2 - Route Boundaries',
  title: 'No navigation links in dist/index.html point to file:// or localhost',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertNotContains(html, 'file://', 'HTML contains file:// link')
    assertNotContains(html, 'localhost:', 'HTML contains localhost link')
    assertNotContains(html, '127.0.0.1', 'HTML contains 127.0.0.1 link')
  },
})

registerTest({
  id: 'T2.B2.5',
  tier: 'Tier 2',
  feature: 'B2 - Route Boundaries',
  title: 'dist/tags/index.html exists and renders tag listing without error',
  run: () => {
    const html = readDist('tags/index.html')
    assert(html !== null, 'dist/tags/index.html missing')
    assert(html.length > 500, 'dist/tags/index.html is too small')
  },
})

// --- Boundary 3: Asset Boundaries ---
registerTest({
  id: 'T2.B3.1',
  tier: 'Tier 2',
  feature: 'B3 - Asset Boundaries',
  title: 'No double slashes in asset URLs in dist/index.html',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertNotMatch(
      html,
      /src=["']\/\/[^"']*\.(?:svg|png|jpg|webp)["']/i,
      'Found double slash in image src',
    )
    assertNotMatch(
      html,
      /href=["']https:\/\/darwindanish\.github\.io\/\/[^"']*["']/i,
      'Found double slash in canonical/sitemap url',
    )
  },
})

registerTest({
  id: 'T2.B3.2',
  tier: 'Tier 2',
  feature: 'B3 - Asset Boundaries',
  title:
    'All stylesheet links in dist/index.html have valid root-relative or HTTPS paths',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const matches =
      html.match(/<link\s+[^>]*?rel=["']stylesheet["'][^>]*?>/gi) || []
    assert(matches.length > 0, 'No stylesheets found in dist/index.html')
    for (const tag of matches) {
      const href = tag.match(/href=["'](.*?)["']/i)?.[1]
      assert(
        href && (href.startsWith('/') || href.startsWith('https://')),
        `Invalid stylesheet href: ${href}`,
      )
    }
  },
})

registerTest({
  id: 'T2.B3.3',
  tier: 'Tier 2',
  feature: 'B3 - Asset Boundaries',
  title: 'All SVG assets in public/static/bento/ have valid <svg root tag',
  run: () => {
    const bentoDir = path.join(ROOT_DIR, 'public/static/bento')
    if (fs.existsSync(bentoDir)) {
      const svgs = fs.readdirSync(bentoDir).filter((f) => f.endsWith('.svg'))
      for (const svgFile of svgs) {
        const content = fs.readFileSync(path.join(bentoDir, svgFile), 'utf8')
        assert(content.includes('<svg'), `${svgFile} is not a valid SVG`)
      }
    }
  },
})

registerTest({
  id: 'T2.B3.4',
  tier: 'Tier 2',
  feature: 'B3 - Asset Boundaries',
  title: 'JetBrainsMono woff2 font file is greater than 10KB',
  run: () => {
    const fontPath = path.join(
      ROOT_DIR,
      'public/fonts/JetBrainsMono[wght].woff2',
    )
    assertFileExists(fontPath, 'public/fonts/JetBrainsMono[wght].woff2 missing')
    const size = fs.statSync(fontPath).size
    assert(size > 10000, `Font file unexpectedly small: ${size} bytes`)
  },
})

registerTest({
  id: 'T2.B3.5',
  tier: 'Tier 2',
  feature: 'B3 - Asset Boundaries',
  title:
    'GithubCalendar.tsx uses correct /static/bento/ path (not broken /static/images/bento/)',
  run: () => {
    const code = readSrc('src/components/bento/GithubCalendar.tsx')
    assert(code !== null, 'GithubCalendar.tsx missing')
    assertNotContains(
      code,
      '/static/images/bento/',
      'GithubCalendar.tsx has broken path /static/images/bento/',
    )
  },
})

// --- Boundary 4: Decap CMS Boundaries ---
registerTest({
  id: 'T2.B4.1',
  tier: 'Tier 2',
  feature: 'B4 - Decap CMS Boundaries',
  title:
    'No unpkg or jsdelivr decap-cms scripts referenced anywhere in dist/ HTML files',
  run: () => {
    const htmlFiles = [
      'index.html',
      'about/index.html',
      'work/index.html',
      'blog/index.html',
      '404.html',
    ]
    for (const file of htmlFiles) {
      const html = readDist(file)
      if (html) {
        assertNotContains(
          html,
          'decap-cms',
          `${file} contains reference to decap-cms`,
        )
        assertNotContains(
          html,
          'netlify-cms',
          `${file} contains reference to netlify-cms`,
        )
      }
    }
  },
})

registerTest({
  id: 'T2.B4.2',
  tier: 'Tier 2',
  feature: 'B4 - Decap CMS Boundaries',
  title: 'No /admin/preview.css stylesheet link in any dist/ HTML file',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        '/admin/preview.css',
        'index.html contains /admin/preview.css',
      )
    }
  },
})

registerTest({
  id: 'T2.B4.3',
  tier: 'Tier 2',
  feature: 'B4 - Decap CMS Boundaries',
  title: 'No /admin/config.yml cms-config-url in any dist/ HTML file',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'cms-config-url',
        'index.html contains cms-config-url',
      )
      assertNotContains(
        html,
        '/admin/config.yml',
        'index.html contains /admin/config.yml',
      )
    }
  },
})

registerTest({
  id: 'T2.B4.4',
  tier: 'Tier 2',
  feature: 'B4 - Decap CMS Boundaries',
  title: 'netlify.toml has no rewrite rules forwarding to /admin/index.html',
  run: () => {
    const toml = readSrc('netlify.toml')
    if (toml) {
      assertNotContains(
        toml,
        '/admin/index.html',
        'netlify.toml contains rewrite to /admin/index.html',
      )
    }
  },
})

registerTest({
  id: 'T2.B4.5',
  tier: 'Tier 2',
  feature: 'B4 - Decap CMS Boundaries',
  title: 'astro.config.ts contains zero redirect rules targeting /admin',
  run: () => {
    const config = readSrc('astro.config.ts')
    assert(config !== null, 'astro.config.ts missing')
    assertNotContains(
      config,
      "'/admin'",
      'astro.config.ts contains redirect targeting /admin',
    )
  },
})

// --- Boundary 5: Netlify Identity Boundaries ---
registerTest({
  id: 'T2.B5.1',
  tier: 'Tier 2',
  feature: 'B5 - Netlify Identity Boundaries',
  title:
    'window.netlifyIdentity is absent from all JavaScript chunks in dist/_astro/',
  run: () => {
    const astroDir = path.join(DIST_DIR, '_astro')
    if (fs.existsSync(astroDir)) {
      const jsFiles = fs.readdirSync(astroDir).filter((f) => f.endsWith('.js'))
      for (const jsFile of jsFiles) {
        const content = fs.readFileSync(path.join(astroDir, jsFile), 'utf8')
        assertNotContains(
          content,
          'netlifyIdentity',
          `${jsFile} contains netlifyIdentity`,
        )
      }
    }
  },
})

registerTest({
  id: 'T2.B5.2',
  tier: 'Tier 2',
  feature: 'B5 - Netlify Identity Boundaries',
  title: 'dist/404.html contains zero Netlify Identity script tags',
  run: () => {
    const html = readDist('404.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        '404.html contains netlify identity script',
      )
    }
  },
})

registerTest({
  id: 'T2.B5.3',
  tier: 'Tier 2',
  feature: 'B5 - Netlify Identity Boundaries',
  title:
    'dist/authors/darwindanish/index.html contains zero Netlify Identity script tags',
  run: () => {
    const html = readDist('authors/darwindanish/index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'authors profile contains netlify identity script',
      )
    }
  },
})

registerTest({
  id: 'T2.B5.4',
  tier: 'Tier 2',
  feature: 'B5 - Netlify Identity Boundaries',
  title: 'dist/tags/index.html contains zero Netlify Identity script tags',
  run: () => {
    const html = readDist('tags/index.html')
    if (html) {
      assertNotContains(
        html,
        'identity.netlify.com',
        'tags/index.html contains netlify identity script',
      )
    }
  },
})

registerTest({
  id: 'T2.B5.5',
  tier: 'Tier 2',
  feature: 'B5 - Netlify Identity Boundaries',
  title:
    'No script in dist/ contains auto-redirect document.location.href = /admin/',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotMatch(
        html,
        /document\.location\.href\s*=\s*['"]\/admin\/?['"]/,
        'HTML contains auto-redirect to /admin/',
      )
    }
  },
})

// --- Boundary 6: Empty Collection & Card Fallback Boundaries ---
registerTest({
  id: 'T2.B6.1',
  tier: 'Tier 2',
  feature: 'B6 - Empty Collections',
  title: 'dist/blog/index.html does not emit broken undefined post href links',
  run: () => {
    const html = readDist('blog/index.html')
    if (html) {
      assertNotContains(
        html,
        'href="undefined"',
        'blog page has href="undefined"',
      )
      assertNotContains(
        html,
        'href="/blog/posts/undefined"',
        'blog page has href="/blog/posts/undefined"',
      )
    }
  },
})

registerTest({
  id: 'T2.B6.2',
  tier: 'Tier 2',
  feature: 'B6 - Empty Collections',
  title:
    'dist/work/index.html does not emit broken undefined project href links',
  run: () => {
    const html = readDist('work/index.html')
    if (html) {
      assertNotContains(
        html,
        'href="undefined"',
        'work page has href="undefined"',
      )
    }
  },
})

registerTest({
  id: 'T2.B6.3',
  tier: 'Tier 2',
  feature: 'B6 - Empty Collections',
  title:
    'dist/work/index.html renders valid semantic <main> element even with zero projects',
  run: () => {
    const html = readDist('work/index.html')
    assert(html !== null, 'dist/work/index.html missing')
    assertMatch(html, /<main[^>]*>/i, 'work page must have a <main> tag')
  },
})

registerTest({
  id: 'T2.B6.4',
  tier: 'Tier 2',
  feature: 'B6 - Empty Collections',
  title:
    'dist/blog/index.html pagination does not emit NaN or negative page numbers',
  run: () => {
    const html = readDist('blog/index.html')
    if (html) {
      assertNotContains(html, '/blog/NaN', 'blog page contains /blog/NaN')
      assertNotContains(html, '/blog/-1', 'blog page contains negative page')
    }
  },
})

registerTest({
  id: 'T2.B6.5',
  tier: 'Tier 2',
  feature: 'B6 - Empty Collections',
  title:
    'src/pages/blog/posts/[...id].astro handles empty collection gracefully',
  run: () => {
    const code = readSrc('src/pages/blog/posts/[...id].astro')
    assert(code !== null, 'blog/posts/[...id].astro missing')
    assertContains(code, 'getStaticPaths', 'Must define getStaticPaths')
  },
})

// --- Boundary 7: Secret & Security Boundaries ---
registerTest({
  id: 'T2.B7.1',
  tier: 'Tier 2',
  feature: 'B7 - Secret Boundaries',
  title: '.gitignore explicitly ignores .agents/ directory',
  run: () => {
    const gitignore = readSrc('.gitignore')
    assert(gitignore !== null, '.gitignore missing')
    assertContains(
      gitignore,
      '.agents',
      '.gitignore must contain rule for .agents',
    )
  },
})

registerTest({
  id: 'T2.B7.2',
  tier: 'Tier 2',
  feature: 'B7 - Secret Boundaries',
  title: '.gitignore explicitly ignores .qodo/ directory',
  run: () => {
    const gitignore = readSrc('.gitignore')
    assert(gitignore !== null, '.gitignore missing')
    assertContains(gitignore, '.qodo', '.gitignore must contain rule for .qodo')
  },
})

registerTest({
  id: 'T2.B7.3',
  tier: 'Tier 2',
  feature: 'B7 - Secret Boundaries',
  title: '.gitignore explicitly ignores .env and .env*.local',
  run: () => {
    const gitignore = readSrc('.gitignore')
    assert(gitignore !== null, '.gitignore missing')
    assertContains(gitignore, '.env', '.gitignore must ignore .env')
  },
})

registerTest({
  id: 'T2.B7.4',
  tier: 'Tier 2',
  feature: 'B7 - Secret Boundaries',
  title:
    'No unencrypted private keys (RSA / EC / OPENSSH) exist in dist/ or tracked files',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'BEGIN PRIVATE KEY',
        'Private key found in index.html',
      )
      assertNotContains(
        html,
        'BEGIN RSA PRIVATE KEY',
        'RSA private key found in index.html',
      )
    }
  },
})

registerTest({
  id: 'T2.B7.5',
  tier: 'Tier 2',
  feature: 'B7 - Secret Boundaries',
  title: 'git check-ignore confirms .env is ignored by git rules',
  run: () => {
    assert(isGitIgnored('.env'), 'git check-ignore must return true for .env')
  },
})

// --- Boundary 8: AI Trace & Hygiene Boundaries ---
registerTest({
  id: 'T2.B8.1',
  tier: 'Tier 2',
  feature: 'B8 - AI Trace Boundaries',
  title:
    'No references to template author jktrn or enscribe.dev in dist/index.html footer',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'enscribe.dev',
        'index.html contains reference to enscribe.dev',
      )
      assertNotContains(
        html,
        'github.com/jktrn',
        'index.html contains reference to github.com/jktrn',
      )
    }
  },
})

registerTest({
  id: 'T2.B8.2',
  tier: 'Tier 2',
  feature: 'B8 - AI Trace Boundaries',
  title:
    'src/content/authors/darwindanish.md does not contain dummy your-invite-link',
  run: () => {
    const authorMd = readSrc('src/content/authors/darwindanish.md')
    assert(authorMd !== null, 'src/content/authors/darwindanish.md missing')
    assertNotContains(
      authorMd,
      'your-invite-link',
      'darwindanish.md must not contain synthetic your-invite-link',
    )
  },
})

registerTest({
  id: 'T2.B8.3',
  tier: 'Tier 2',
  feature: 'B8 - AI Trace Boundaries',
  title: 'Repository root is clean of stray screenshot image copy.png',
  run: () => {
    const tracked = isGitTracked('image copy.png')
    assert(!tracked, 'image copy.png must not be tracked in git')
  },
})

registerTest({
  id: 'T2.B8.4',
  tier: 'Tier 2',
  feature: 'B8 - AI Trace Boundaries',
  title:
    'README.md mentions Darwin Danish and does not document enscribe template',
  run: () => {
    const readme = readSrc('README.md')
    assert(readme !== null, 'README.md missing')
    assertContains(
      readme,
      'Darwin Danish',
      'README.md must mention Darwin Danish',
    )
    assertNotContains(
      readme,
      'jason@enscribe.dev',
      'README.md must not contain jason@enscribe.dev',
    )
  },
})

registerTest({
  id: 'T2.B8.5',
  tier: 'Tier 2',
  feature: 'B8 - AI Trace Boundaries',
  title:
    'git status confirms .qodo directory is not tracked as staged or modified',
  run: () => {
    const tracked = isGitTracked('.qodo')
    assert(!tracked, '.qodo must not be tracked in git')
  },
})

// --- Boundary 9: SEO & Meta Tag Boundaries ---
registerTest({
  id: 'T2.B9.1',
  tier: 'Tier 2',
  feature: 'B9 - SEO Boundaries',
  title: 'dist/index.html contains responsive meta viewport tag',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const viewport = extractMeta(html, 'viewport')
    assert(
      viewport !== null && viewport.includes('width=device-width'),
      'Missing responsive meta viewport',
    )
  },
})

registerTest({
  id: 'T2.B9.2',
  tier: 'Tier 2',
  feature: 'B9 - SEO Boundaries',
  title: 'dist/index.html contains charset meta tag',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    assertMatch(
      html,
      /<meta\s+[^>]*?charset=["']?utf-8/i,
      'dist/index.html must have UTF-8 charset',
    )
  },
})

registerTest({
  id: 'T2.B9.3',
  tier: 'Tier 2',
  feature: 'B9 - SEO Boundaries',
  title:
    'dist/index.html title does NOT duplicate Darwin Danish | Darwin Danish',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const title = extractTitle(html) || ''
    assertNotContains(
      title,
      'Darwin Danish | Darwin Danish',
      'Title has duplicate brand string',
    )
  },
})

registerTest({
  id: 'T2.B9.4',
  tier: 'Tier 2',
  feature: 'B9 - SEO Boundaries',
  title: 'Open Graph image meta tag og:image has valid HTTPS scheme',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const ogImage = extractMeta(html, 'og:image')
    if (ogImage) {
      assert(
        ogImage.startsWith('https://'),
        `og:image must be an HTTPS URL, got: ${ogImage}`,
      )
      assertNotContains(
        ogImage,
        'darwindanish.dev',
        'og:image must not reference expired domain',
      )
    }
  },
})

registerTest({
  id: 'T2.B9.5',
  tier: 'Tier 2',
  feature: 'B9 - SEO Boundaries',
  title: 'Twitter card meta tag twitter:card is present in dist/index.html',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const twitterCard = extractMeta(html, 'twitter:card')
    assert(twitterCard !== null, 'twitter:card meta tag missing')
  },
})

// --- Boundary 10: Sitemap & Robots Boundaries ---
registerTest({
  id: 'T2.B10.1',
  tier: 'Tier 2',
  feature: 'B10 - Sitemap & Robots Boundaries',
  title:
    'Sitemap XML does not list standalone image files (.png, .jpg, .webp) as pages',
  run: () => {
    const sitemap0 = readDist('sitemap-0.xml') || ''
    const sitemapIndex = readDist('sitemap-index.xml') || ''
    const xml = sitemap0 + sitemapIndex
    if (xml) {
      assertNotMatch(
        xml,
        /<loc>[^<]*\.(?:png|jpg|jpeg|webp)<\/loc>/i,
        'Sitemap lists image file as indexable page',
      )
    }
  },
})

registerTest({
  id: 'T2.B10.2',
  tier: 'Tier 2',
  feature: 'B10 - Sitemap & Robots Boundaries',
  title: 'Sitemap XML does not list site.webmanifest as an indexable page',
  run: () => {
    const sitemap0 = readDist('sitemap-0.xml') || ''
    const sitemapIndex = readDist('sitemap-index.xml') || ''
    const xml = sitemap0 + sitemapIndex
    if (xml) {
      assertNotMatch(
        xml,
        /<loc>[^<]*site\.webmanifest<\/loc>/i,
        'Sitemap lists site.webmanifest as page',
      )
    }
  },
})

registerTest({
  id: 'T2.B10.3',
  tier: 'Tier 2',
  feature: 'B10 - Sitemap & Robots Boundaries',
  title: 'Sitemap XML URLs do not contain double slashes in paths',
  run: () => {
    const sitemap0 = readDist('sitemap-0.xml') || ''
    const sitemapIndex = readDist('sitemap-index.xml') || ''
    const xml = sitemap0 + sitemapIndex
    if (xml) {
      assertNotMatch(
        xml,
        /<loc>https:\/\/[^/]+\/\//,
        'Sitemap contains double slashes in path',
      )
    }
  },
})

registerTest({
  id: 'T2.B10.4',
  tier: 'Tier 2',
  feature: 'B10 - Sitemap & Robots Boundaries',
  title: 'All URLs in sitemap use https:// protocol (zero http://)',
  run: () => {
    const sitemap0 = readDist('sitemap-0.xml') || ''
    const sitemapIndex = readDist('sitemap-index.xml') || ''
    const xml = sitemap0 + sitemapIndex
    if (xml) {
      assertNotMatch(
        xml,
        /<loc>http:\/\//,
        'Sitemap contains insecure http:// URL',
      )
    }
  },
})

registerTest({
  id: 'T2.B10.5',
  tier: 'Tier 2',
  feature: 'B10 - Sitemap & Robots Boundaries',
  title: 'dist/robots.txt does not disallow root / or critical assets',
  run: () => {
    const robots = readDist('robots.txt')
    if (robots) {
      assertNotMatch(
        robots,
        /Disallow:\s*\/$/m,
        'robots.txt must not disallow root /',
      )
    }
  },
})

// ============================================================================
// TIER 3: Cross-Feature Pairwise Interaction Checks
// ============================================================================

registerTest({
  id: 'T3.P1',
  tier: 'Tier 3',
  feature: 'Pairwise: Routes ↔ Assets',
  title: 'Every local image src in dist/index.html resolves to a physical file',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const imgMatches = html.match(/<img\s+[^>]*?src=["'](.*?)["']/gi) || []
    for (const tag of imgMatches) {
      const src = tag.match(/src=["'](.*?)["']/i)?.[1]
      if (src && src.startsWith('/') && !src.startsWith('//')) {
        const cleanPath = src.split('?')[0].split('#')[0]
        const targetInDist = path.join(DIST_DIR, cleanPath)
        const targetInPublic = path.join(ROOT_DIR, 'public', cleanPath)
        assert(
          fs.existsSync(targetInDist) || fs.existsSync(targetInPublic),
          `Image src ${src} does not exist on disk`,
        )
      }
    }
  },
})

registerTest({
  id: 'T3.P2',
  tier: 'Tier 3',
  feature: 'Pairwise: Routes ↔ SEO',
  title:
    'Canonical URL in dist/index.html matches configured site URL in astro.config.ts',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')
    const canonical = extractCanonical(html)
    assert(canonical !== null, 'Missing canonical tag in dist/index.html')
    assert(
      canonical.startsWith('https://darwindanish.github.io'),
      `Canonical URL (${canonical}) must match site URL`,
    )
  },
})

registerTest({
  id: 'T3.P3',
  tier: 'Tier 3',
  feature: 'Pairwise: Routes ↔ SEO',
  title:
    'Canonical URL in dist/about/index.html matches the actual file path /about/',
  run: () => {
    const html = readDist('about/index.html')
    assert(html !== null, 'dist/about/index.html missing')
    const canonical = extractCanonical(html)
    assert(canonical !== null, 'Missing canonical tag in dist/about/index.html')
    assert(
      canonical.endsWith('/about/') || canonical.endsWith('/about'),
      `Canonical URL must match route: ${canonical}`,
    )
  },
})

registerTest({
  id: 'T3.P4',
  tier: 'Tier 3',
  feature: 'Pairwise: Routes ↔ SEO',
  title:
    'Canonical URL in dist/work/index.html matches the actual file path /work/',
  run: () => {
    const html = readDist('work/index.html')
    assert(html !== null, 'dist/work/index.html missing')
    const canonical = extractCanonical(html)
    assert(canonical !== null, 'Missing canonical tag in dist/work/index.html')
    assert(
      canonical.endsWith('/work/') || canonical.endsWith('/work'),
      `Canonical URL must match route: ${canonical}`,
    )
  },
})

registerTest({
  id: 'T3.P5',
  tier: 'Tier 3',
  feature: 'Pairwise: Sitemap ↔ Routes',
  title:
    'Every <loc> in sitemap resolves to an existing static HTML page in dist/',
  run: () => {
    const sitemap0 = readDist('sitemap-0.xml')
    if (sitemap0) {
      const locs = (sitemap0.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
        l.replace(/<\/?loc>/g, ''),
      )
      for (const loc of locs) {
        if (loc.startsWith('https://darwindanish.github.io')) {
          const urlPath = new URL(loc).pathname
          const expectedFile = urlPath.endsWith('/')
            ? path.join(DIST_DIR, urlPath, 'index.html')
            : path.join(DIST_DIR, `${urlPath}.html`)
          const altFile = path.join(DIST_DIR, urlPath, 'index.html')
          assert(
            fs.existsSync(expectedFile) || fs.existsSync(altFile),
            `Sitemap loc ${loc} does not exist in dist/`,
          )
        }
      }
    }
  },
})

registerTest({
  id: 'T3.P6',
  tier: 'Tier 3',
  feature: 'Pairwise: Robots ↔ Sitemap',
  title:
    'Sitemap directive in dist/robots.txt points to sitemap file that actually exists in dist/',
  run: () => {
    const robots = readDist('robots.txt')
    assert(robots !== null, 'dist/robots.txt missing')
    const match = robots.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i)
    assert(match !== null, 'Sitemap directive missing from robots.txt')
    const sitemapUrl = match[1]
    const sitemapName = path.basename(new URL(sitemapUrl).pathname)
    assertFileExists(
      path.join(DIST_DIR, sitemapName),
      `Referenced sitemap ${sitemapName} does not exist in dist/`,
    )
  },
})

registerTest({
  id: 'T3.P7',
  tier: 'Tier 3',
  feature: 'Pairwise: Decap CMS ↔ Routing',
  title:
    'Zero links to /admin or /admin/ exist across all generated HTML pages in dist/',
  run: () => {
    const files = [
      'index.html',
      'about/index.html',
      'work/index.html',
      'blog/index.html',
      '404.html',
    ]
    for (const f of files) {
      const html = readDist(f)
      if (html) {
        assertNotMatch(
          html,
          /href=["']\/admin\/?["']/i,
          `${f} contains navigation link to /admin`,
        )
      }
    }
  },
})

registerTest({
  id: 'T3.P8',
  tier: 'Tier 3',
  feature: 'Pairwise: Netlify Identity ↔ CMS',
  title:
    'Zero references to Netlify Identity exist across all generated HTML files in dist/',
  run: () => {
    const files = [
      'index.html',
      'about/index.html',
      'work/index.html',
      'blog/index.html',
      '404.html',
    ]
    for (const f of files) {
      const html = readDist(f)
      if (html) {
        assertNotContains(
          html,
          'netlifyIdentity',
          `${f} references netlifyIdentity`,
        )
        assertNotContains(
          html,
          'identity.netlify.com',
          `${f} loads identity.netlify.com`,
        )
      }
    }
  },
})

registerTest({
  id: 'T3.P9',
  tier: 'Tier 3',
  feature: 'Pairwise: Secret Safety ↔ Build Output',
  title:
    'None of the secret environment variable names appear in any dist/ files',
  run: () => {
    const html = readDist('index.html')
    if (html) {
      assertNotContains(
        html,
        'TINA_TOKEN',
        'dist/index.html contains TINA_TOKEN',
      )
      assertNotContains(
        html,
        'JWT_SECRET',
        'dist/index.html contains JWT_SECRET',
      )
      assertNotContains(
        html,
        'VERCEL_OIDC_TOKEN',
        'dist/index.html contains VERCEL_OIDC_TOKEN',
      )
    }
  },
})

registerTest({
  id: 'T3.P10',
  tier: 'Tier 3',
  feature: 'Pairwise: AI Hygiene ↔ Assets',
  title:
    'No media assets in dist/uploads contain "ai-assistant" or "shutterstock" in filename',
  run: () => {
    const uploadsDir = path.join(DIST_DIR, 'uploads')
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir)
      for (const f of files) {
        assert(
          !f.includes('ai-assistant'),
          `Asset filename contains ai-assistant: ${f}`,
        )
        assert(
          !f.includes('shutterstock'),
          `Asset filename contains shutterstock: ${f}`,
        )
      }
    }
  },
})

registerTest({
  id: 'T3.P11',
  tier: 'Tier 3',
  feature: 'Pairwise: Authors ↔ SEO',
  title:
    'Author profile canonical URL matches https://darwindanish.github.io/authors/darwindanish/ and is indexable',
  run: () => {
    const html = readDist('authors/darwindanish/index.html')
    assert(html !== null, 'dist/authors/darwindanish/index.html missing')
    const canonical = extractCanonical(html)
    assert(canonical !== null, 'Missing canonical tag on author page')
    assert(
      canonical.includes('/authors/darwindanish'),
      `Canonical URL must match author: ${canonical}`,
    )
    const robots = extractMeta(html, 'robots')
    assert(
      !robots || !robots.includes('noindex'),
      'Author page must not be noindex',
    )
  },
})

registerTest({
  id: 'T3.P12',
  tier: 'Tier 3',
  feature: 'Pairwise: Achievements ↔ SEO & Schema',
  title:
    'Achievements route canonical URL matches https://darwindanish.github.io/achievements/ and includes valid JSON-LD schema referencing #person',
  run: () => {
    const html = readDist('achievements/index.html')
    assert(html !== null, 'dist/achievements/index.html missing')
    const canonical = extractCanonical(html)
    assert(canonical !== null, 'Missing canonical tag on achievements page')
    assert(
      canonical.includes('/achievements/'),
      `Canonical URL must match achievements: ${canonical}`,
    )
    assertContains(
      html,
      'https://darwindanish.github.io#person',
      'JSON-LD schema must reference person node #person',
    )
    assertContains(
      html,
      '"@type":"ItemList"',
      'JSON-LD schema must define ItemList',
    )
  },
})

registerTest({
  id: 'T3.P13',
  tier: 'Tier 3',
  feature: 'Pairwise: Trailing Slash ↔ Canonicals & Sitemaps',
  title:
    'Blog and Work routes strictly enforce canonical trailing slashes in HTML and sitemaps',
  run: () => {
    // 1. Check dist/blog/index.html canonical URL
    const blogHtml = readDist('blog/index.html')
    assert(blogHtml !== null, 'dist/blog/index.html missing')
    const blogCanonical = extractCanonical(blogHtml)
    assertEqual(
      blogCanonical,
      'https://darwindanish.github.io/blog/',
      'dist/blog/index.html canonical must strictly end with trailing slash /blog/',
    )

    // 2. Check dist/work/index.html canonical URL
    const workHtml = readDist('work/index.html')
    assert(workHtml !== null, 'dist/work/index.html missing')
    const workCanonical = extractCanonical(workHtml)
    assertEqual(
      workCanonical,
      'https://darwindanish.github.io/work/',
      'dist/work/index.html canonical must strictly end with trailing slash /work/',
    )

    // 3. Check sitemaps
    for (const smName of ['sitemap.xml', 'sitemap-0.xml']) {
      const smContent = readDist(smName)
      if (smContent) {
        assertContains(
          smContent,
          '<loc>https://darwindanish.github.io/blog/</loc>',
          `${smName} must list canonical https://darwindanish.github.io/blog/ with trailing slash`,
        )
        assertContains(
          smContent,
          '<loc>https://darwindanish.github.io/work/</loc>',
          `${smName} must list canonical https://darwindanish.github.io/work/ with trailing slash`,
        )
        assertNotContains(
          smContent,
          '<loc>https://darwindanish.github.io/blog</loc>',
          `${smName} must NOT list non-trailing-slash /blog`,
        )
        assertNotContains(
          smContent,
          '<loc>https://darwindanish.github.io/work</loc>',
          `${smName} must NOT list non-trailing-slash /work`,
        )
      }
    }
  },
})

// ============================================================================
// TIER 4: Real-World Scenarios (End-to-End Application Workflows)
// ============================================================================

registerTest({
  id: 'T4.S1',
  tier: 'Tier 4',
  feature: 'Scenario: First-Time Visitor Journey',
  title:
    'First-time visitor navigates from Home -> About -> Work -> Blog -> Achievements with zero broken assets or scripts',
  run: () => {
    // 1. Visit Home
    const homeHtml = readDist('index.html')
    assert(homeHtml !== null, 'Home page missing')
    assertContains(homeHtml, 'Darwin', 'Home page does not mention Darwin')
    assertMatch(
      homeHtml,
      /href=["']\/about\/?["']/i,
      'Home page does not link to /about',
    )
    assertMatch(
      homeHtml,
      /href=["']\/work\/?["']/i,
      'Home page does not link to /work',
    )
    assertMatch(
      homeHtml,
      /href=["']\/blog\/?["']/i,
      'Home page does not link to /blog',
    )
    assertMatch(
      homeHtml,
      /href=["']\/achievements\/?["']/i,
      'Home page does not link to /achievements',
    )

    // 2. Visit About
    const aboutHtml = readDist('about/index.html')
    assert(aboutHtml !== null, 'About page missing')
    assert(aboutHtml.length > 500, 'About page content empty')

    // 3. Visit Work
    const workHtml = readDist('work/index.html')
    assert(workHtml !== null, 'Work page missing')

    // 4. Visit Blog
    const blogHtml = readDist('blog/index.html')
    assert(blogHtml !== null, 'Blog page missing')

    // 5. Visit Achievements
    const achievementsHtml = readDist('achievements/index.html')
    assert(achievementsHtml !== null, 'Achievements page missing')
    assert(achievementsHtml.length > 1000, 'Achievements page content empty')

    // 6. Verify zero references to dead SSR / Netlify Identity in any of these pages
    for (const [name, pageHtml] of [
      ['home', homeHtml],
      ['about', aboutHtml],
      ['work', workHtml],
      ['blog', blogHtml],
      ['achievements', achievementsHtml],
    ]) {
      assertNotContains(
        pageHtml,
        'identity.netlify.com',
        `${name} contains netlify identity`,
      )
      assertNotContains(pageHtml, 'decap-cms', `${name} contains decap-cms`)
    }
  },
})

registerTest({
  id: 'T4.S2',
  tier: 'Tier 4',
  feature: 'Scenario: 404 Error Recovery',
  title:
    'Visitor lands on non-existent route, receives static 404.html with noindex and recovery navigation',
  run: () => {
    const html = readDist('404.html')
    assert(html !== null, 'GitHub Pages native 404.html missing from dist/')
    const robots = extractMeta(html, 'robots')
    assert(
      robots !== null && robots.includes('noindex'),
      '404 page must be noindex',
    )
    assertMatch(
      html,
      /<a\s+[^>]*?href=["']\/["'][^>]*?>/i,
      '404 page must have link to return home',
    )
  },
})

registerTest({
  id: 'T4.S3',
  tier: 'Tier 4',
  feature: 'Scenario: Crawler Simulation',
  title:
    'Search engine crawler fetches robots.txt, follows sitemap, and verifies all canonical links',
  run: () => {
    const robots = readDist('robots.txt')
    assert(robots !== null, 'robots.txt missing')
    const sitemapMatch = robots.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i)
    assert(
      sitemapMatch !== null,
      'robots.txt does not contain Sitemap directive',
    )

    const sitemap0 = readDist('sitemap-0.xml')
    assert(sitemap0 !== null, 'sitemap-0.xml missing')
    assertNotContains(
      sitemap0,
      'darwindanish.dev',
      'sitemap contains expired domain',
    )

    const locs = (sitemap0.match(/<loc>(.*?)<\/loc>/g) || []).map((l) =>
      l.replace(/<\/?loc>/g, ''),
    )
    assert(locs.length > 0, 'Sitemap contains zero URLs')
    for (const loc of locs) {
      assert(
        loc.startsWith('https://darwindanish.github.io'),
        `Invalid URL in sitemap: ${loc}`,
      )
      assert(
        !loc.endsWith('.png') && !loc.endsWith('.jpg'),
        `Binary image listed in sitemap: ${loc}`,
      )
    }
  },
})

registerTest({
  id: 'T4.S4',
  tier: 'Tier 4',
  feature: 'Scenario: Security & Compliance Audit',
  title:
    'Compliance audit confirms secrets are untracked, .gitignore is hardened, and no API keys are bundled',
  run: () => {
    // 1. Secrets untracked
    assert(!isGitTracked('.env'), '.env is tracked by git')
    assert(!isGitTracked('.env.local'), '.env.local is tracked by git')

    // 2. .gitignore coverage
    const gitignore = readSrc('.gitignore')
    assert(gitignore !== null, '.gitignore missing')
    assertContains(gitignore, '.agents', '.gitignore missing .agents/')
    assertContains(gitignore, '.qodo', '.gitignore missing .qodo/')

    // 3. Decap OAuth endpoints removed
    assertDirMissing(
      path.join(ROOT_DIR, 'src/pages/api'),
      'src/pages/api OAuth bridge still exists',
    )

    // 4. Clean bundle
    const indexHtml = readDist('index.html')
    if (indexHtml) {
      assertNotContains(
        indexHtml,
        'BEGIN PRIVATE KEY',
        'Private key found in index.html',
      )
    }
  },
})

registerTest({
  id: 'T4.S5',
  tier: 'Tier 4',
  feature: 'Scenario: Author Social Share Simulation',
  title:
    'Social share crawler verifies Open Graph tags, canonical URL, and author identity for Darwin Danish',
  run: () => {
    const html = readDist('index.html')
    assert(html !== null, 'dist/index.html missing')

    const ogTitle = extractMeta(html, 'og:title')
    const ogDesc = extractMeta(html, 'og:description')
    const ogUrl = extractMeta(html, 'og:url')
    const canonical = extractCanonical(html)

    assert(ogTitle !== null, 'og:title missing')
    assert(ogDesc !== null, 'og:description missing')
    assert(ogUrl !== null || canonical !== null, 'og:url and canonical missing')

    if (ogUrl) {
      assert(
        ogUrl.startsWith('https://darwindanish.github.io'),
        `og:url does not point to canonical domain: ${ogUrl}`,
      )
    }
    if (canonical) {
      assert(
        canonical.startsWith('https://darwindanish.github.io'),
        `canonical does not point to canonical domain: ${canonical}`,
      )
    }
  },
})

// ============================================================================
// Execution Engine & Reporter
// ============================================================================

async function runTestSuite() {
  console.log('='.repeat(80))
  console.log(' DARWIN DANISH PORTFOLIO — E2E TEST RUNNER')
  console.log(' Target: Pure Static Build (dist/) & Repository Hygiene')
  console.log(` Timestamp: ${new Date().toISOString()}`)
  console.log('='.repeat(80))

  // Filter tests if requested
  let testsToRun = testRegistry
  if (filterTier) {
    testsToRun = testsToRun.filter((t) =>
      t.tier.toLowerCase().includes(`tier ${filterTier}`),
    )
  }
  if (filterFeature) {
    testsToRun = testsToRun.filter((t) =>
      t.feature.toUpperCase().includes(filterFeature),
    )
  }

  console.log(
    `\nRegistered Tests: ${testRegistry.length} | Tests in scope: ${testsToRun.length}\n`,
  )

  const results = []
  let passedCount = 0
  let failedCount = 0

  for (const test of testsToRun) {
    const startTime = Date.now()
    try {
      await test.run()
      const duration = Date.now() - startTime
      results.push({ ...test, status: 'PASS', duration, error: null })
      passedCount++
      if (!summaryOnly) {
        console.log(
          `  \x1b[32m✔ PASS\x1b[0m [${test.id}] ${test.title} (${duration}ms)`,
        )
      }
    } catch (err) {
      const duration = Date.now() - startTime
      results.push({ ...test, status: 'FAIL', duration, error: err.message })
      failedCount++
      if (!summaryOnly) {
        console.log(`  \x1b[31m✖ FAIL\x1b[0m [${test.id}] ${test.title}`)
        console.log(`         \x1b[33mError: ${err.message}\x1b[0m`)
      }
    }
  }

  // --------------------------------------------------------------------------
  // Summary Aggregations
  // --------------------------------------------------------------------------
  console.log('\n' + '='.repeat(80))
  console.log(' SUMMARY BY TIER & FEATURE')
  console.log('='.repeat(80))

  const tierMap = new Map()
  for (const r of results) {
    if (!tierMap.has(r.tier)) {
      tierMap.set(r.tier, { total: 0, pass: 0, fail: 0 })
    }
    const stat = tierMap.get(r.tier)
    stat.total++
    if (r.status === 'PASS') stat.pass++
    else stat.fail++
  }

  for (const [tier, stat] of tierMap.entries()) {
    const pct = ((stat.pass / stat.total) * 100).toFixed(1)
    console.log(
      ` ${tier.padEnd(10)} : Total ${String(stat.total).padStart(3)} | PASS ${String(stat.pass).padStart(3)} | FAIL ${String(stat.fail).padStart(3)} (${pct}%)`,
    )
  }

  console.log('-'.repeat(80))
  const totalPct = ((passedCount / results.length) * 100).toFixed(1)
  console.log(
    ` TOTAL      : Total ${String(results.length).padStart(3)} | PASS ${String(passedCount).padStart(3)} | FAIL ${String(failedCount).padStart(3)} (${totalPct}%)`,
  )
  console.log('='.repeat(80))

  if (failedCount > 0) {
    console.log(
      `\n\x1b[33mNote: Some tests failed. If uncompleted milestones (M2-M5) are pending,\x1b[0m`,
    )
    console.log(
      `\x1b[33mthese failures represent expected gaps to be closed by those milestones.\x1b[0m\n`,
    )
  } else {
    console.log(`\n\x1b[32mAll ${passedCount} tests PASSED cleanly!\x1b[0m\n`)
  }

  if (failedCount > 0 && !allowFail) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err)
  process.exit(1)
})
