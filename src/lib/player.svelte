<script>
  export let song;
  export let color;

  let audioEl;
  let paused = true;

  let duration;
  let currentTime = 0;

  const toggle = () => (paused ? audioEl.play() : audioEl.pause());
</script>

<section class="song" style="--color: {color}">
  <audio
    bind:this={audioEl}
    bind:paused
    bind:duration
    bind:currentTime
    src={song.src}
  />

  <span class="controls" on:click={toggle}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="white"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {#if paused}
        <polygon points="14 11 28 20 14 29 14 11" />
      {:else}
        <path
          class="progress"
          d={`M20 ${(40 - 31.831) / 2}
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831`}
          fill="none"
          stroke="white"
          stroke-width="32"
          stroke-linecap="butt"
          stroke-dasharray={`${(currentTime / duration) * 100}, 100`}
        />
        <rect x="13.5" y="12" width="3.5" height="16" />
        <rect x="22.5" y="12" width="3.5" height="16" />
      {/if}
    </svg>
  </span>
  {song.name}
</section>

<style>
  .song {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 1rem;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 0.75rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    background-color: var(--color);
    color: white;
    border-radius: 50%;
  }

  .progress {
    opacity: 0.3;
  }
</style>
