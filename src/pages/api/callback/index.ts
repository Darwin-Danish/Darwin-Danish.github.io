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
        <head>
          <title>Authenticating...</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f4f4f4; }
            .content { text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="content">
            <h2>Completing authentication...</h2>
            <p>This window should close automatically.</p>
          </div>
          <script>
            (function() {
              const authData = ${JSON.stringify(data)};
              const message = 'authorization:github:success:' + JSON.stringify(authData);
              
              // 1. Try to send the message immediately
              if (window.opener) {
                console.log("Sending success message to opener...");
                window.opener.postMessage(message, "*");
              } else {
                console.log("No opener found.");
                document.querySelector('p').innerText = "Error: No opener window found. Please try closing this and logging in again.";
              }

              // 2. Also listen for the 'authorizing:github' handshake just in case Decap CMS needs it
              window.addEventListener("message", function(e) {
                console.log("Received message from opener:", e.data);
                if (e.data === "authorizing:github") {
                  window.opener.postMessage(message, e.origin);
                }
              }, false);

              // 3. Signal that we are ready for the handshake
              if (window.opener) {
                window.opener.postMessage("authorizing:github", "*");
              }
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
