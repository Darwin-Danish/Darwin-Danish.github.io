import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site }) => {
  const sitemapURL = new URL('sitemap-0.xml', site)
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapURL.href}</loc>
  </sitemap>
</sitemapindex>`

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
