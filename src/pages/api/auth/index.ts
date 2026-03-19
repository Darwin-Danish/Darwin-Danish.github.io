import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ redirect }) => {
  const client_id = process.env.GITHUB_CLIENT_ID
  if (!client_id) {
    return new Response('GITHUB_CLIENT_ID not set', { status: 500 })
  }

  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`
  return redirect(url)
}
