<script>
  export let song;
  export let color;

  let audioEl;
  let paused = true;

  const toggle = () => (paused ? audioEl.play() : audioEl.pause());
</script>

<section class="song" style="--color: {color}">
  <audio bind:this={audioEl} bind:paused src={song.src} />

  <span class="controls" on:click={toggle}>
    {#if paused}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="5.5" y="4" width="3.5" height="16" />
        <rect x="14.5" y="4" width="3.5" height="16" />
      </svg>
    {/if}
  </span>
  {song.name}
</section>

<style>
  .song {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 0.5rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    background-color: var(--color);
    color: white;
    border-radius: 50%;
  }
</style>
