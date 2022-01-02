<script>
  import '../app.css';

  import { onMount } from 'svelte';

  import Search from '$lib/search.svelte';
  import Viz from '$lib/viz.svelte';

  let token = '';

  let artists = {};
  let searchedArtist;
  let group = 1;

  onMount(async () => {
    token = await fetch('/auth')
      .then(r => r.json())
      .then(r => r.access_token);
  });

  const relate = async artist => {
    const url = `/relate?artist=${artist.id}&group=${group}&token=${token}`;
    fetch(url)
      .then(resp => resp.json())
      .then(related => {
        artists = {
          ...artists,
          [artist.name]: { ...artist, targets: Object.keys(related) },
          ...related,
        };
        group++;
      });
  };

  const onSelection = ({ detail }) => {
    searchedArtist = { ...detail.selection.value, group: 0, targets: [] };
    artists = {
      [searchedArtist.name]: searchedArtist,
    };
    relate(searchedArtist);
  };
</script>

<Search {token} on:selection={onSelection} />

<Viz {artists} onClick={relate} />
