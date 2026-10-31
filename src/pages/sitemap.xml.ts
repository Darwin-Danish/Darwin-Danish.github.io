import type { APIRoute } from 'astro'

const staticRoutes = [
  '',
  'about/',
  'achievements/',
  'authors/',
  'authors/darwindanish/',
  'blog/',
  'blog/posts/lumina-journey/',
  'tags/',
  'tags/IoT/',
  'tags/ML/',
  'work/',
]

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site
    ? site.href.replace(/\/$/, '')
    : 'https://darwindanish.github.io'

  const urlEntries = staticRoutes
    .map((route) => `  <url><loc>${baseUrl}/${route}</loc></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
