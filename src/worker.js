export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/auth') {
      return handleAuth(request, env);
    }
    if (url.pathname === '/api/callback') {
      return handleCallback(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleAuth(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  try {
    const url = new URL(request.url);
    const redirectUrl = new URL('https://github.com/login/oauth/authorize');
    redirectUrl.searchParams.set('client_id', client_id);
    redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
    redirectUrl.searchParams.set('scope', 'repo user');
    redirectUrl.searchParams.set(
      'state',
      crypto.getRandomValues(new Uint8Array(12)).join(''),
    );
    return Response.redirect(redirectUrl.href, 301);
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

function renderBody(status, content) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `;
  return new Blob([html]);
}

async function handleCallback(request, env) {
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'castromonje-cms-oauth',
        accept: 'application/json',
      },
      body: JSON.stringify({ client_id, client_secret, code }),
    });
    const result = await response.json();

    if (result.error) {
      return new Response(renderBody('error', result), {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
        status: 401,
      });
    }

    const responseBody = renderBody('success', {
      token: result.access_token,
      provider: 'github',
    });
    return new Response(responseBody, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
      status: 500,
    });
  }
}
