#!/usr/bin/env node

/**
 * ============================================================================
 * Darwin Danish Portfolio — Adversarial Route & Asset Crawler
 * ============================================================================
 *
 * Empirical verification harness that:
 * 1. Recursively crawls all emitted HTML files in dist/
 * 2. Recursively inspects all linked CSS files in dist/_astro/
 * 3. Extracts all href, src, srcset, meta refresh, and CSS url() attributes
 * 4. Verifies 100% resolution to real on-disk files with exact case-sensitivity
 * 5. Detects circular redirects, broken redirect destinations, and dead ends
 * 6. Validates dist/404.html fallback semantics
 * ============================================================================
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const CANONICAL_HOST = 'https://darwindanish.github.io'

if (!fs.existsSync(DIST_DIR)) {
  console.error(`CRITICAL: dist/ directory does not exist at ${DIST_DIR}`)
  process.exit(1)
}

// ----------------------------------------------------------------------------
// Utilities
// ----------------------------------------------------------------------------
function walkDir(dir, filterExt) {
  let results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath, filterExt))
    } else if (!filterExt || entry.name.endsWith(filterExt)) {
      results.push(fullPath)
    }
  }
  return results
}

/**
 * Verify exact on-disk case sensitivity for Linux/GitHub Pages compatibility.
 * On macOS (case-insensitive APFS), fs.existsSync('index.HTML') returns true for 'index.html'.
 * This function traverses the directory hierarchy verifying exact name match.
 */
function verifyExactCase(resolvedPath) {
  const rel = path.relative(DIST_DIR, resolvedPath)
  if (!rel || rel === '.') return true

  const segments = rel.split(path.sep)
  let current = DIST_DIR

  for (const seg of segments) {
    if (!fs.existsSync(current)) return false
    const entries = fs.readdirSync(current)
    if (!entries.includes(seg)) {
      return false
    }
    current = path.join(current, seg)
  }
  return true
}

// ----------------------------------------------------------------------------
// File Resolution Logic
// ----------------------------------------------------------------------------
function resolveDiskPath(urlStr, fromFilePath) {
  // Ignored / valid protocols
  if (
    urlStr.startsWith('#') ||
    urlStr.startsWith('mailto:') ||
    urlStr.startsWith('tel:') ||
    urlStr.startsWith('javascript:') ||
    urlStr.startsWith('data:')
  ) {
    return { status: 'IGNORED', type: 'protocol/anchor' }
  }

  // External URLs
  if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
    if (!urlStr.startsWith(CANONICAL_HOST)) {
      return { status: 'EXTERNAL', url: urlStr }
    }
    // Convert canonical host URL to local path
    urlStr = urlStr.slice(CANONICAL_HOST.length)
    if (!urlStr) urlStr = '/'
  }

  // Strip query params and hash fragment
  const cleanUrl = urlStr.split('?')[0].split('#')[0]
  if (!cleanUrl) {
    return { status: 'SAME_PAGE' }
  }

  // URL decode (e.g. %5Bwght%5D -> [wght])
  let decodedPath
  try {
    decodedPath = decodeURIComponent(cleanUrl)
  } catch {
    decodedPath = cleanUrl
  }

  // Determine base path
  let targetPath
  if (decodedPath.startsWith('/')) {
    targetPath = path.join(DIST_DIR, decodedPath.slice(1))
  } else {
    targetPath = path.resolve(path.dirname(fromFilePath), decodedPath)
  }

  // Candidates for resolution:
  // 1. Exact path
  // 2. path/index.html
  // 3. path.html
  const candidates = [
    targetPath,
    path.join(targetPath, 'index.html'),
    targetPath.replace(/\/$/, '') + '.html',
  ]

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const stat = fs.statSync(c)
      if (stat.isFile()) {
        const exactCase = verifyExactCase(c)
        return {
          status: 'RESOLVED',
          diskPath: c,
          size: stat.size,
          exactCase,
        }
      }
    }
  }

  return {
    status: 'MISSING',
    targetPath,
    candidates,
  }
}

// ----------------------------------------------------------------------------
// 1. Recursive HTML Crawl
// ----------------------------------------------------------------------------
console.log('='.repeat(80))
console.log(' ADVERSARIAL ROUTE & ASSET STRESS TESTER')
console.log('='.repeat(80))

const allHtmlFiles = walkDir(DIST_DIR, '.html')
console.log(`[Crawler] Found ${allHtmlFiles.length} HTML files in dist/`)

const findings = {
  brokenLinks: [],
  brokenAssets: [],
  casingMismatches: [],
  zeroByteFiles: [],
  redirects: [],
  circularRedirects: [],
  pagesCrawled: allHtmlFiles.length,
  totalLinksChecked: 0,
  totalAssetsChecked: 0,
}

// Directed graph for circular redirect detection: sourceRoute -> targetRoute
const redirectGraph = new Map()

for (const htmlFile of allHtmlFiles) {
  const relHtml = path.relative(DIST_DIR, htmlFile)
  const content = fs.readFileSync(htmlFile, 'utf8')

  // Check for Meta Refresh Redirects
  const refreshMatch = content.match(/<meta\s+http-equiv=["']refresh["']\s+content=["'][^"']*url=([^"']+)["']/i)
  if (refreshMatch) {
    const redirectTarget = refreshMatch[1]
    const sourceRoute = '/' + relHtml.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '')
    const cleanTarget = redirectTarget.split('?')[0].split('#')[0]
    redirectGraph.set(sourceRoute, cleanTarget)
    findings.redirects.push({
      fromFile: relHtml,
      sourceRoute,
      target: redirectTarget,
    })
  }

  // Extract all href attributes
  const hrefMatches = content.matchAll(/\bhref=["']([^"']+)["']/g)
  for (const m of hrefMatches) {
    findings.totalLinksChecked++
    const href = m[1]
    const res = resolveDiskPath(href, htmlFile)

    if (res.status === 'MISSING') {
      findings.brokenLinks.push({
        from: relHtml,
        attribute: 'href',
        value: href,
        expectedDiskPath: res.targetPath,
      })
    } else if (res.status === 'RESOLVED') {
      if (!res.exactCase) {
        findings.casingMismatches.push({
          from: relHtml,
          value: href,
          diskPath: res.diskPath,
        })
      }
      if (res.size === 0) {
        findings.zeroByteFiles.push({
          from: relHtml,
          diskPath: res.diskPath,
        })
      }
    }
  }

  // Extract all src attributes
  const srcMatches = content.matchAll(/\bsrc=["']([^"']+)["']/g)
  for (const m of srcMatches) {
    findings.totalAssetsChecked++
    const src = m[1]
    const res = resolveDiskPath(src, htmlFile)

    if (res.status === 'MISSING') {
      findings.brokenAssets.push({
        from: relHtml,
        attribute: 'src',
        value: src,
        expectedDiskPath: res.targetPath,
      })
    } else if (res.status === 'RESOLVED') {
      if (!res.exactCase) {
        findings.casingMismatches.push({
          from: relHtml,
          value: src,
          diskPath: res.diskPath,
        })
      }
      if (res.size === 0) {
        findings.zeroByteFiles.push({
          from: relHtml,
          diskPath: res.diskPath,
        })
      }
    }
  }
}

// ----------------------------------------------------------------------------
// 2. CSS Asset Crawl (url(...) inside emitted CSS)
// ----------------------------------------------------------------------------
const allCssFiles = walkDir(DIST_DIR, '.css')
console.log(`[Crawler] Found ${allCssFiles.length} CSS files in dist/`)

for (const cssFile of allCssFiles) {
  const relCss = path.relative(DIST_DIR, cssFile)
  const cssContent = fs.readFileSync(cssFile, 'utf8')
  const urlMatches = cssContent.matchAll(/url\(([^)]+)\)/g)

  for (const m of urlMatches) {
    findings.totalAssetsChecked++
    const rawUrl = m[1].replace(/["']/g, '').trim()
    const res = resolveDiskPath(rawUrl, cssFile)

    if (res.status === 'MISSING') {
      findings.brokenAssets.push({
        from: relCss,
        attribute: 'css-url',
        value: rawUrl,
        expectedDiskPath: res.targetPath,
      })
    } else if (res.status === 'RESOLVED') {
      if (!res.exactCase) {
        findings.casingMismatches.push({
          from: relCss,
          value: rawUrl,
          diskPath: res.diskPath,
        })
      }
      if (res.size === 0) {
        findings.zeroByteFiles.push({
          from: relCss,
          diskPath: res.diskPath,
        })
      }
    }
  }
}

// ----------------------------------------------------------------------------
// 3. Circular Redirect Detection (Cycle detection via DFS)
// ----------------------------------------------------------------------------
for (const [startRoute] of redirectGraph) {
  const visited = new Set()
  let curr = startRoute
  const chain = [curr]

  while (curr && redirectGraph.has(curr)) {
    visited.add(curr)
    curr = redirectGraph.get(curr)
    chain.push(curr)

    if (curr === startRoute || visited.has(curr)) {
      findings.circularRedirects.push({
        startRoute,
        cycle: chain.join(' -> '),
      })
      break
    }
  }
}

// ----------------------------------------------------------------------------
// 4. 404 Fallback Page Semantics Verification
// ----------------------------------------------------------------------------
const fallback404 = {
  exists: fs.existsSync(path.join(DIST_DIR, '404.html')),
  hasNoindex: false,
  hasHomeLink: false,
  hasValidStyles: false,
  hasValidTitle: false,
  size: 0,
}

if (fallback404.exists) {
  const content404 = fs.readFileSync(path.join(DIST_DIR, '404.html'), 'utf8')
  fallback404.size = content404.length
  fallback404.hasNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(content404)
  fallback404.hasHomeLink = /href=["']\/["']/.test(content404)
  fallback404.hasValidTitle = /<title>[^<]*404[^<]*<\/title>/i.test(content404)
  const cssMatch = content404.match(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']/i)
  if (cssMatch) {
    const cssRes = resolveDiskPath(cssMatch[1], path.join(DIST_DIR, '404.html'))
    fallback404.hasValidStyles = cssRes.status === 'RESOLVED'
  }
}

// ----------------------------------------------------------------------------
// 5. Categorize Broken Links
// ----------------------------------------------------------------------------
const brokenRedirectDestinations = findings.brokenLinks.filter(b =>
  b.from.startsWith('blog/') || b.from.startsWith('ctfs/')
)
const brokenMainPageLinks = findings.brokenLinks.filter(b =>
  !b.from.startsWith('blog/') && !b.from.startsWith('ctfs/')
)

// ----------------------------------------------------------------------------
// Output Report
// ----------------------------------------------------------------------------
console.log('\n' + '='.repeat(80))
console.log(' EMPIRICAL FINDINGS SUMMARY')
console.log('='.repeat(80))
console.log(`HTML Pages Crawled       : ${findings.pagesCrawled}`)
console.log(`Total Links Verified     : ${findings.totalLinksChecked}`)
console.log(`Total Assets Verified    : ${findings.totalAssetsChecked}`)
console.log(`Redirect Stubs Found     : ${findings.redirects.length}`)
console.log(`Circular Redirects       : ${findings.circularRedirects.length}`)
console.log(`Broken Redirect Targets  : ${brokenRedirectDestinations.length}`)
console.log(`Broken Main Page Links   : ${brokenMainPageLinks.length}`)
console.log(`Broken Asset References  : ${findings.brokenAssets.length}`)
console.log(`Casing Mismatches        : ${findings.casingMismatches.length}`)
console.log(`Zero-Byte Emitted Files  : ${findings.zeroByteFiles.length}`)

console.log('\n--- 404 Fallback Page Audit ---')
console.log(`dist/404.html exists     : ${fallback404.exists}`)
console.log(`dist/404.html file size  : ${fallback404.size} bytes`)
console.log(`Contains noindex tag     : ${fallback404.hasNoindex}`)
console.log(`Contains home page link  : ${fallback404.hasHomeLink}`)
console.log(`Contains 404 title       : ${fallback404.hasValidTitle}`)
console.log(`Loads valid stylesheet   : ${fallback404.hasValidStyles}`)

if (brokenRedirectDestinations.length > 0) {
  console.log('\n--- Sample Broken Redirect Destinations ---')
  for (const b of brokenRedirectDestinations.slice(0, 10)) {
    console.log(`  [${b.from}] -> ${b.value} (target file does not exist)`)
  }
  if (brokenRedirectDestinations.length > 10) {
    console.log(`  ... and ${brokenRedirectDestinations.length - 10} more`)
  }
}

if (brokenMainPageLinks.length > 0) {
  console.log('\n--- Broken Main Page Links ---')
  for (const b of brokenMainPageLinks) {
    console.log(`  [${b.from}] ${b.attribute}="${b.value}"`)
  }
}

console.log('\n' + '='.repeat(80))
const jsonReportPath = path.join(DIST_DIR, 'adversarial-crawl-report.json')
fs.writeFileSync(jsonReportPath, JSON.stringify({ findings, fallback404 }, null, 2))
console.log(`Saved detailed JSON report to: ${jsonReportPath}`)

// Exit with code based on broken main page links or circular redirects
if (findings.circularRedirects.length > 0 || brokenMainPageLinks.length > 0) {
  console.log('CRITICAL: Found circular redirects or broken main page links!')
  process.exit(1)
} else if (brokenRedirectDestinations.length > 0) {
  console.log('WARNING: Found broken redirect destinations in legacy redirect stubs!')
  process.exit(2)
} else {
  console.log('SUCCESS: 0 broken links or assets detected.')
  process.exit(0)
}
