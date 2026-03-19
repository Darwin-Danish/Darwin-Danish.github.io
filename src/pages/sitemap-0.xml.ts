import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { getAllPosts, getAllProjects, getAllAuthors, getSortedTags } from '@/lib/data-utils'
import { SITE } from '@/consts'

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Site URL not configured', { status: 500 })
  }

  // Get all content
  const blogPosts = await getAllPosts() // Dynamic, non-draft, top-level
  const projects = await getAllProjects()
  const authors = await getAllAuthors()
  const tags = await getSortedTags()
  
  // Also get subposts (all blog entries including subposts)
  const allPosts = await getCollection('blog', ({ data }) => !data.draft)

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/work',
    '/blog',
    '/authors',
    '/tags',
  ]

  const currentDate = new Date().toISOString()
  
  // 1. Static Pages
  const staticUrls = staticPages.map(page => {
    const url = page === '' ? '/' : page + '/'
    const loc = new URL(url, site).href
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  // 2. Pagination pages
  const postsPerPage = SITE.postsPerPage || 4
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)
  let paginationUrls = ''
  if (totalPages > 1) {
    for (let i = 2; i <= totalPages; i++) {
      const loc = new URL(`/blog/posts/${i}/`, site).href
      paginationUrls += `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>\n`
    }
  }

  // 3. Blog Posts (Top-level and Subposts)
  const allPostUrls = allPosts.map(post => {
    const url = `/blog/posts/${post.id}/`
    const loc = new URL(url, site).href
    let imageTags = ''
    
    // Add featured image if it exists
    if (post.data.image) {
      const rawImage =
        typeof post.data.image === 'object' && 'src' in post.data.image
          ? post.data.image.src
          : typeof post.data.image === 'string'
            ? post.data.image
            : ''
      if (rawImage) {
        const imageUrl = new URL(rawImage, site).href
        imageTags = `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(post.data.title)}</image:title>
      <image:caption>${escapeXml(post.data.description)}</image:caption>
    </image:image>`
      }
    }
    
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${post.data.date?.toISOString() || currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageTags}
  </url>`
  }).join('\n')

  // 4. Projects
  const projectUrls = projects.map(project => {
    const loc = new URL(`/work#${project.id}`, site).href
    let imageTags = ''
    
    if (project.data.image) {
      const rawImage =
        typeof project.data.image === 'object' && 'src' in project.data.image
          ? project.data.image.src
          : typeof project.data.image === 'string'
            ? project.data.image
            : ''
      if (rawImage) {
        const imageUrl = new URL(rawImage, site).href
        imageTags = `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(project.data.name)}</image:title>
      <image:caption>${escapeXml(project.data.description)}</image:caption>
    </image:image>`
      }
    }
    
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${imageTags}
  </url>`
  }).join('\n')

  // 5. Authors
  const authorUrls = authors.map(author => {
    const loc = new URL(`/authors/${author.id}/`, site).href
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  }).join('\n')

  // 6. Tags (Dynamic)
  const tagUrls = tags.map(tagItem => {
    const loc = new URL(`/tags/${tagItem.tag}/`, site).href
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
  }).join('\n')

  // 7. Important static assets
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
    const loc = new URL(asset, site).href
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticUrls}
${paginationUrls}
${allPostUrls}
${projectUrls}
${authorUrls}
${tagUrls}
${assetUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
