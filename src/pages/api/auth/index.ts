import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ redirect }) => {
  const client_id = import.meta.env.GITHUB_CLIENT_ID
  if (!client_id) {
    return new Response('Error: GITHUB_CLIENT_ID is not set in Vercel environment variables.', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`
  
  // Return a robust redirect response
  return new Response(
    `<html><head><meta http-equiv="refresh" content="0; url=${url}"></head><body>Redirecting to <a href="${url}">${url}</a></body></html>`,
    {
      status: 302,
      headers: {
        'Location': url,
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  )
}
