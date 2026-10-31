import type { APIRoute } from 'astro'

const getRobotsTxt = (sitemapIndexURL: URL, sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapIndexURL.href}
Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const sitemapIndexURL = new URL('sitemap-index.xml', site)
  const sitemapURL = new URL('sitemap.xml', site)
  return new Response(getRobotsTxt(sitemapIndexURL, sitemapURL))
}
