<script>
  import '../app.css';
  import { schemeDark2 } from 'd3-scale-chromatic';
  import { onMount } from 'svelte';

  import About from '$lib/about.svelte';
  import Info from '$lib/info.svelte';
  import Search from '$lib/search.svelte';
  import Viz from '$lib/viz.svelte';

  let token = '';
  let pristine = true;

  let group = 1;
  let artists = {};
  let searchedArtist;
  let infoArtist;

  let noRelatedFound = true;

  onMount(async () => {
    token = await fetch('/auth')
      .then(r => r.json())
      .then(r => r.access_token);
  });

  const showInfo = async artist => {
    fetch(
      `/info?artist=${artist.id}&name=${encodeURIComponent(
        artist.name,
      )}&token=${token}`,
    )
      .then(resp => resp.json())
      .then(({ bio, lastfmURL, song }) => {
        infoArtist = {
          ...artist,
          bio,
          song,
          external_urls: {
            ...artist.external_urls,
            lastfm: lastfmURL,
          },
        };
      });
  };

  const onInfoClose = () => {
    infoArtist = null;
  };

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

        // force info for artist with no related artists found
        if (Object.keys(artists).length === 1 && !Object.keys(related).length) {
          showInfo(Object.values(artists)[0]);
          noRelatedFound = true;
        } else {
          noRelatedFound = false;
        }
      });
  };

  const onSelection = ({ detail }) => {
    if (pristine) {
      pristine = false;
    }

    noRelatedFound = true;
    onInfoClose();

    searchedArtist = {
      ...detail.selection.value,
      group: 0,
      color: schemeDark2[0],
      targets: [],
    };
    artists = {
      [searchedArtist.name]: searchedArtist,
    };
    relate(searchedArtist);
  };
</script>

<div id="svelte" class:pristine>
  {#if pristine}
    <section class="title">
      <h1>fans also like...</h1>
      <p>discover new music similar to artists you already know and like</p>
    </section>
  {/if}

  <Search {token} on:selection={onSelection} />

  {#if !pristine}
    <Viz
      {artists}
      {infoArtist}
      {noRelatedFound}
      {onInfoClose}
      onInfoClick={showInfo}
      onRelateClick={relate}
    />

    {#if infoArtist}
      <Info artist={infoArtist} {noRelatedFound} onClose={onInfoClose} />
    {/if}
  {/if}

  <About />
</div>

<style>
  #svelte {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  #svelte.pristine {
    justify-content: center;
    align-items: center;
  }

  .title {
    width: 20rem;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
  }
</style>
