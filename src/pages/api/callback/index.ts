import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code')
  const client_id = import.meta.env.GITHUB_CLIENT_ID
  const client_secret = import.meta.env.GITHUB_CLIENT_SECRET

  if (!code || !client_id || !client_secret) {
    let missing = []
    if (!code) missing.push('code')
    if (!client_id) missing.push('GITHUB_CLIENT_ID')
    if (!client_secret) missing.push('GITHUB_CLIENT_SECRET')
    return new Response(`Auth configuration missing: ${missing.join(', ')}`, { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    })
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    })

    const data = await response.json()

    if (data.error) {
      return new Response(data.error_description || data.error, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    // Return HTML that posts the token back to the CMS opener window
    const content = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("Receiving message:", e.data);
                if (e.data == "authorizing:github") {
                  window.opener.postMessage(
                    'authorization:github:success:${JSON.stringify(data)}',
                    e.origin
                  );
                }
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })()
          </script>
        </body>
      </html>
    `
    return new Response(content, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    return new Response('OAuth exchange failed', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
