export async function get({ url }) {
  const { VITE_LASTFM_TOKEN } = import.meta.env;
  const name = url.searchParams.get('name');

  const bioResp = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=${VITE_LASTFM_TOKEN}&format=json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(r => r.json());

  const lastWords = new RegExp(
    `\\s*?<a href="https://www.last.fm/music/.*">Read more on Last.fm</a>. User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.`,
  );

  const bio = (bioResp.artist?.bio?.content ?? '')
    .replace(lastWords, '')
    .trim()
    .replace(/\n/g, '<br />');

  const artist = url.searchParams.get('artist');

  const tracksResp = await fetch(
    `https://api.spotify.com/v1/artists/${artist}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${url.searchParams.get('token')}`,
      },
    },
  ).then(r => r.json());

  const playable = tracksResp.tracks.find(track => track.preview_url);

  return {
    body: {
      bio,
      lastfmURL: bioResp.artist?.url ?? '',
      song: playable
        ? {
            link: playable.external_urls.spotify,
            src: playable.preview_url,
            name: playable.name,
          }
        : {},
    },
  };
}
