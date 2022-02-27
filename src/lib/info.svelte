<script>
  import Player from './player.svelte';
  import { fly } from 'svelte/transition';

  export let artist;
  export let noRelatedFound;
  export let onClose;

  const imageUrl = artist.images?.[0]?.url;

  const onKeyDown = evt => {
    if (!noRelatedFound && evt.key === 'Escape') {
      onClose();
    }
  };
</script>

<svelte:window on:keydown={onKeyDown} />

<section
  class="modal"
  transition:fly={{ y: 15 }}
  style="--artist-color: {artist.color}"
>
  {#if imageUrl}
    <img class="artist-image" src={imageUrl} alt={`${artist.name} image`} />
  {/if}

  <h1>{artist.name}</h1>

  {#if noRelatedFound}
    <p class="no-related">No related artists found, try another search</p>
  {/if}

  {#if artist.bio}
    <section class="content">{@html artist.bio}</section>
  {/if}

  {#if artist.song.src}
    <Player song={artist.song} color={artist.color} />
  {/if}

  <section class="links">
    {#if artist.external_urls.spotify}
      <a
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/spotify.png" alt="spotify profile link" />
      </a>
    {/if}

    {#if artist.external_urls.lastfm}
      <a
        href={artist.external_urls.lastfm}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/lastfm.png" alt="last.fm profile link" />
      </a>
    {/if}
  </section>

  {#if !noRelatedFound}
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
  {/if}
</section>

<style>
  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 3rem));
    overflow: visible;

    background: white;
    width: 320px;
    max-height: 440px;
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

  h1 {
    margin: -3rem auto 0;
    padding: 0.75rem;
    text-align: center;
    background-color: var(--artist-color);
    color: white;
    border-radius: 0.5rem;
  }

  .artist-image {
    min-width: 16rem;
    min-height: 16rem;
    width: 16rem;
    height: 16rem;
    margin: -8rem auto 0;
    border-radius: 50%;
    border: 7.5px solid var(--artist-color);

    overflow: hidden;
    object-fit: cover;
  }

  .content {
    border: 2.5px solid var(--artist-color);
    border-radius: 5px;
    overflow-y: scroll;
    padding: 0.5rem;
    font-size: 12px;
    line-height: 1.5;
    margin-top: 1.25rem;
  }

  .links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0 -3rem;
  }

  .links a {
    border: 5px solid var(--artist-color);
    border-radius: 50%;
    width: 3.5rem;
    height: 3.5rem;
    overflow: hidden;
    display: flex;
  }

  .links img {
    margin: -1px;
  }

  .no-related {
    color: red;
    font-size: 12px;
    margin-bottom: 0;
  }
</style>
