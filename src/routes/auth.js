export async function get() {
  const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env;
  const rawAuth = `${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`;
  const encodedAuth = Buffer.from(rawAuth).toString('base64');

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedAuth}`,
    },
    body: 'grant_type=client_credentials',
  }).then(r => r.json());

  return {
    body: resp,
  };
}
