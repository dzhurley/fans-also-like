<script>
  import { fade } from 'svelte/transition';

  let open = false;
</script>

{#if open}
  <section class="modal" transition:fade={{ duration: 200 }}>
    <p>
      Search, relationships, photos, and song samples provided by
      <a
        href="https://www.spotify.com"
        target="_blank"
        rel="noopener noreferrer">Spotify</a
      >. Artist bios supplied by
      <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer"
        >last.fm</a
      >. Made with ❤️ and 🍵 on
      <a
        href="https://github.com/dzhurley/fans-also-like"
        target="_blank"
        rel="noopener noreferrer">Github</a
      >.
    </p>
  </section>
{/if}

<span class="button" on:click={() => (open = !open)}>
  {#if open}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  {:else}
    ?
  {/if}
</span>

<style>
  .modal {
    position: absolute;
    bottom: 3rem;
    right: 3rem;

    background: white;
    width: 260px;
    border: 5px solid black;
    border-radius: 1rem;
    padding: 0 1rem;

    display: flex;
    flex-direction: column;
  }

  .button {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    background-color: black;
    color: white;
    border-radius: 50%;
  }

  p {
    font-size: 12px;
    line-height: 1.5;
  }
</style>
