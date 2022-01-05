export async function get({ url }) {
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${url.searchParams.get('q')}&type=artist`,
    {
      headers: {
        Authorization: `Bearer ${url.searchParams.get('token')}`,
      },
    },
  ).then(r => r.json());

  return {
    body: resp.artists.items,
  };
}
