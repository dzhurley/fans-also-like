<script>
  import '../app.css';

  import { schemeTableau10 } from 'd3-scale-chromatic';
  import { onMount } from 'svelte';

  import Info from '$lib/info.svelte';
  import Search from '$lib/search.svelte';
  import Viz from '$lib/viz.svelte';

  let token = '';

  let group = 1;
  let artists = {};
  let searchedArtist;
  let infoArtist;

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
        // if related come up that have already been found, remove them to
        // preserve existing targets
        const remainingRelated = Object.entries(related).reduce(
          (remaining, [relatedName, relatedArtist]) => {
            const existing = Object.keys(artists).some(
              name => relatedName === name,
            );
            if (!existing) {
              remaining[relatedName] = relatedArtist;
            }
            return remaining;
          },
          {},
        );

        artists = {
          ...artists,
          [artist.name]: {
            ...artist,
            targets: Object.keys(related),
          },
          ...remainingRelated,
        };
        group++;
      });
  };

  const onSelection = ({ detail }) => {
    searchedArtist = {
      ...detail.selection.value,
      group: 0,
      color: schemeTableau10[0],
      targets: [],
    };
    artists = {
      [searchedArtist.name]: searchedArtist,
    };
    relate(searchedArtist);
  };

  const showInfo = async artist => {
    fetch(`/info?artist=${artist.id}&name=${artist.name}&token=${token}`)
      .then(resp => resp.json())
      .then(({ bio, song }) => {
        infoArtist = {
          ...artist,
          bio,
          song,
        };
      });
  };

  const onInfoClose = () => {
    infoArtist = null;
  };
</script>

<Search {token} on:selection={onSelection} />

<Viz {artists} {infoArtist} onInfoClick={showInfo} onRelateClick={relate} />

{#if infoArtist}
  <Info artist={infoArtist} onClose={onInfoClose} />
{/if}
