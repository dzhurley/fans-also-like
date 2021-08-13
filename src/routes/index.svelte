<script>
  import { onMount } from 'svelte';

  import Search from '$lib/search.svelte';

  let token = '---';

  let artist;
  let related = [];

  onMount(async () => {
    token = await fetch('/auth')
      .then(r => r.json())
      .then(r => r.access_token);
  });

  $: {
    if (artist) {
      fetch(`/relate?artist=${artist.id}&token=${token}`)
        .then(r => r.json())
        .then(r => (related = r));
    }
  }
</script>

<Search {token} bind:selection={artist} />

<h1>Result</h1>
<pre>
  {JSON.stringify(artist, null, 2)}
</pre>

<h2>Related</h2>
<pre>
  {JSON.stringify(related, null, 2)}
</pre>

<style>
  :global(body) {
    font-family: Consolas, Monaco, monospace;
    background-color: #002b36;
    color: #839496;
  }
</style>
