export async function get({ query }) {
  const artist = query.get('artist');
  const group = parseInt(query.get('group'));

  const resp = await fetch(
    `https://api.spotify.com/v1/artists/${artist}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${query.get('token')}`,
      },
    },
  ).then(r => r.json());

  return {
    body: resp.artists.reduce((artists, artist, index) => {
      if (index < 5) {
        artists[artist.name] = { ...artist, group, targets: [] };
      }
      return artists;
    }, {}),
  };
}
