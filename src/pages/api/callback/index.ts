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
            <h2 id="status-title">Completing authentication...</h2>
            <p id="status-text">Connecting back to the CMS...</p>
            <p id="debug-info" style="font-size: 10px; color: #999; margin-top: 20px;"></p>
          </div>
          <script>
            (function() {
              const authData = ${JSON.stringify(data)};
              const message = 'authorization:github:success:' + JSON.stringify(authData);
              const debug = document.getElementById('debug-info');
              const statusText = document.getElementById('status-text');
              
              debug.innerText = "Opener: " + (window.opener ? "Found" : "NOT FOUND") + " | Origin: " + window.location.origin;

              if (!window.opener) {
                statusText.innerText = "Error: Authentication window lost connection to the CMS. Please close this and try again.";
                statusText.style.color = "red";
                return;
              }

              // Function to send the message
              function send() {
                try {
                  window.opener.postMessage(message, "*");
                  window.opener.postMessage("authorizing:github", "*");
                  console.log("Sent message to opener...");
                } catch (e) {
                  debug.innerText += " | Error: " + e.message;
                }
              }

              // Send immediately
              send();

              // Also listen for a handshake
              window.addEventListener("message", function(e) {
                console.log("Received handshake:", e.data);
                if (e.data === "authorizing:github") {
                  send();
                }
              }, false);

              // Repeat every 500ms until the window is closed by the CMS
              const interval = setInterval(() => {
                if (!window.opener || window.opener.closed) {
                  clearInterval(interval);
                  return;
                }
                send();
              }, 500);
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
