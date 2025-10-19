import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ site }) => {
  // Get all blog posts
  const blogPosts = await getCollection('blog')
  
  // Get all projects
  const projects = await getCollection('projects')
  
  // Get all authors
  const authors = await getCollection('authors')
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/work',
    '/blog',
    '/blog/2',
    '/blog/3',
    '/authors',
    '/tags',
    '/tags/algorithm',
    '/tags/buffer-overflow',
    '/tags/compilation',
    '/tags/ctf',
    '/tags/forensics',
    '/tags/game-hacking',
    '/tags/geoint',
    '/tags/osint',
    '/tags/other',
    '/tags/ppc',
    '/tags/pwn',
    '/tags/reverse',
    '/tags/travel',
    '/tags/unity',
  ]

  const currentDate = new Date().toISOString()
  
  // Generate URLs for blog posts
  const blogUrls = blogPosts.map(post => {
    const url = `/blog/${post.id}/`
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${post.data.date?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  // Generate URLs for projects
  const projectUrls = projects.map(project => {
    const url = `/work#${project.id}`
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  // Generate URLs for authors
  const authorUrls = authors.map(author => {
    const url = `/authors/${author.id}/`
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  // Generate URLs for static pages
  const staticUrls = staticPages.map(page => {
    const url = page === '' ? '/' : page + '/'
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticUrls}
${blogUrls}
${projectUrls}
${authorUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
