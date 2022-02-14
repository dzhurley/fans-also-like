export async function get({ url }) {
  const { VITE_LASTFM_TOKEN } = import.meta.env;
  const artist = url.searchParams.get('artist');

  const resp = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${VITE_LASTFM_TOKEN}&format=json`,
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

  return {
    body: {
      bioFull: resp.artist.bio.content,
      bio: resp.artist.bio.content
        .replace(lastWords, '')
        .trim()
        .replace(/\n/g, '<br />'),
    },
  };
}
