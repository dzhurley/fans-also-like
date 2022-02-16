<script>
  import Player from './player.svelte';

  export let artist;
  export let onClose;

  const imageUrl = artist.images?.[0]?.url;
</script>

<section class="modal" style="--artist-color: {artist.color}">
  <span class="close-button" on:click={onClose}>
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
  </span>

  <section class="header">
    {#if imageUrl}
      <img src={imageUrl} alt={`${artist.name} image`} />
    {/if}

    <h1>{artist.name}</h1>
  </section>

  <section class="content">{@html artist.bio}</section>

  <Player song={artist.song} color={artist.color} />
</section>

<style>
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: visible;

    background: white;
    width: 450px;
    height: 400px;
    border: 5px solid var(--artist-color);
    border-radius: 1rem;
    padding: 1rem;

    display: flex;
    flex-direction: column;
  }

  .close-button {
    position: absolute;
    top: -1.75rem;
    right: -1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    background-color: var(--artist-color);
    color: white;
    border-radius: 50%;
  }

  .header {
    display: flex;
  }

  h1 {
    line-height: 1.5;
    font-size: 1.4rem;
    margin-left: 1rem;
  }

  img {
    min-width: 13rem;
    min-height: 13rem;
    width: 13rem;
    height: 13rem;
    margin: -4rem 1rem 1rem -4rem;
    border-radius: 50%;
    border: 7.5px solid var(--artist-color);
    overflow: hidden;
    object-fit: cover;
    z-index: -1;
  }

  .content {
    border: 2.5px solid var(--artist-color);
    border-radius: 5px;
    overflow-y: scroll;
    padding: 0.5rem 1rem;
    line-height: 1.75;
  }
</style>
