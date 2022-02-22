<script>
  import Player from './player.svelte';

  export let artist;
  export let onClose;

  const imageUrl = artist.images?.[0]?.url;

  const onKeyDown = evt => {
    if (evt.key === 'Escape') {
      onClose();
    }
  };
</script>

<svelte:window on:keydown={onKeyDown} />

<section class="modal" style="--artist-color: {artist.color}">
  {#if imageUrl}
    <img src={imageUrl} alt={`${artist.name} image`} />
  {/if}

  <h1>{artist.name}</h1>

  {#if artist.bio}
    <section class="content">{@html artist.bio}</section>
  {/if}

  {#if artist.song.src}
    <Player song={artist.song} color={artist.color} />
  {/if}

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

  img {
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
</style>
