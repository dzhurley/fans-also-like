<script>
  import { onMount } from 'svelte';

  let token = '---';

  let artists;

  onMount(async () => {
    token = await fetch('/auth')
      .then(r => r.json())
      .then(r => r.access_token);

    artists = await fetch(`/search?q=Holly&token=${token}`).then(r => r.json());
  });
</script>

<pre>
  {JSON.stringify(artists, null, 2)}
</pre>

<style>
  :global(body) {
    font-family: Consolas, Monaco, monospace;
    background-color: #002b36;
    color: #839496;
  }
</style>
