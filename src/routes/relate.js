import { schemeTableau10 } from 'd3-scale-chromatic';

export async function get({ url }) {
  const artist = url.searchParams.get('artist');
  const group = parseInt(url.searchParams.get('group'));

  const resp = await fetch(
    `https://api.spotify.com/v1/artists/${artist}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${url.searchParams.get('token')}`,
      },
    },
  ).then(r => r.json());

  return {
    body: resp.artists.reduce((artists, artist, index) => {
      if (index < 5) {
        artists[artist.name] = {
          ...artist,
          group,
          color: schemeTableau10[group % 10],
          targets: [],
        };
      }
      return artists;
    }, {}),
  };
}
