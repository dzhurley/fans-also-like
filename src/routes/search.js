export async function get({ query }) {
  const resp = await fetch(
    `https://api.spotify.com/v1/search?q=${query.get('q')}&type=artist`,
    {
      headers: {
        Authorization: `Bearer ${query.get('token')}`,
      },
    },
  ).then(r => r.json());

  return {
    body: resp.artists.items,
  };
}
