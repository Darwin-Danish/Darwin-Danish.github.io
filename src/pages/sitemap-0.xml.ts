import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

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
  
  // Generate URLs for blog posts with images
  const blogUrls = blogPosts.length > 0 ? blogPosts.map(post => {
    const url = `/blog/${post.id}/`
    let imageTags = ''
    
    // Add featured image if it exists
    if (post.data.image) {
      const imageUrl = post.data.image.src.startsWith('http') 
        ? post.data.image.src 
        : `${site}${post.data.image.src}`
      imageTags = `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(post.data.title)}</image:title>
      <image:caption>${escapeXml(post.data.description)}</image:caption>
    </image:image>`
    }
    
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${post.data.date?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageTags}
  </url>`
  }).join('\n') : ''

  // Generate URLs for projects with images
  const projectUrls = projects.length > 0 ? projects.map(project => {
    const url = `/work#${project.id}`
    let imageTags = ''
    
    // Add project image if it exists
    if (project.data.image) {
      const imageUrl = project.data.image.src.startsWith('http') 
        ? project.data.image.src 
        : `${site}${project.data.image.src}`
      imageTags = `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(project.data.name)}</image:title>
      <image:caption>${escapeXml(project.data.description)}</image:caption>
    </image:image>`
    }
    
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageTags}
  </url>`
  }).join('\n') : ''

  // Generate URLs for authors
  const authorUrls = authors.length > 0 ? authors.map(author => {
    const url = `/authors/${author.id}/`
    return `  <url>
    <loc>${site}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n') : ''

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

  // Generate URLs for important static assets
  const staticAssets = [
    '/static/logo.png',
    '/static/logo.svg',
    '/static/logo.webp',
    '/static/showcase-card.png',
    '/static/twitter-card.png',
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/site.webmanifest'
  ]

  const assetUrls = staticAssets.map(asset => {
    return `  <url>
    <loc>${site}${asset}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticUrls}
${blogUrls}
${projectUrls}
${authorUrls}
${assetUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
