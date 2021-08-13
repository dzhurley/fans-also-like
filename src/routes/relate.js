export async function get({ query }) {
  const artist = query.get('artist');
  const resp = await fetch(
    `https://api.spotify.com/v1/artists/${artist}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${query.get('token')}`,
      },
    },
  ).then(r => r.json());

  return {
    body: resp.artists.map(({ id, name }) => ({
      id,
      name,
    })),
  };
}
