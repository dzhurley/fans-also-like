<script>
  export let artist;
  export let onRelateClick;
  export let onInfoClick;

  let top = 0;
  let left = 0;

  const onMouseMove = evt => {
    if (!artist) {
      left = evt.clientX;
      top = evt.clientY;
    }
  };
</script>

<svelte:window on:mousemove={onMouseMove} />

{#if artist}
  <ul style="--artist-color: {artist.color}; --top: {top}px; --left: {left}px">
    {#if !artist.targets.length}
      <li on:click={() => onRelateClick(artist)}>also</li>
    {/if}
    <li on:click={() => onInfoClick(artist)}>info</li>
  </ul>
{/if}

<style>
  ul {
    position: absolute;
    top: var(--top);
    left: var(--left);

    list-style: none;
    margin: 0;
    padding: 0;

    border-radius: 0.5rem;
    border: 2.5px solid var(--artist-color);
    background: white;
  }

  li {
    padding: 0.5rem;
    cursor: pointer;
  }

  li:nth-of-type(2n) {
    border-top: 2.5px solid var(--artist-color);
  }

  li:hover {
    background-color: var(--artist-color);
    color: white;
  }
</style>
