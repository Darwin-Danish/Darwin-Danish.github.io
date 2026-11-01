import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapIndexURL: URL, sitemapURL: URL) => `User-agent: *
Allow: /

# Agentic AI Crawlers & LLM Indexers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${sitemapIndexURL.href}
Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const sitemapIndexURL = new URL('sitemap-index.xml', site)
  const sitemapURL = new URL('sitemap.xml', site)
  return new Response(getRobotsTxt(sitemapIndexURL, sitemapURL))
}
