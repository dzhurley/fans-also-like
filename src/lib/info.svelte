<script>
  export let artist;
  export let onClose;

  const imageUrl = artist.images?.[0]?.url;

  const genres = artist.genres.slice(0, 3);
</script>

<section class="modal" style="--artist-color: {artist.color}">
  {#if imageUrl}
    <img src={imageUrl} alt={`${artist.name} image`} />
  {/if}

  <span class="close-button" on:click={onClose}>x</span>

  <section class="header">
    <h1>{artist.name}</h1>

    {#if genres.length}
      <ul class="genres">
        {#each genres as genre}
          <li>{genre}</li>
        {/each}
      </ul>
    {/if}
  </section>
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
    height: 200px;
    border: 1px solid var(--artist-color);
    border-radius: 1rem;
    padding: 1rem;
  }

  img {
    position: absolute;
    top: -2rem;
    left: -2rem;
    width: 13rem;
    height: 13rem;
    max-width: 13rem;
    max-height: 13rem;
    border-radius: 50%;
    border: 7.5px solid var(--artist-color);
    overflow: hidden;
    object-fit: cover;
    z-index: -1;
  }

  .close-button {
    position: absolute;
    top: -1.75rem;
    right: -1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0.5rem;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    background-color: var(--artist-color);
    color: white;
    border-radius: 50%;
  }

  h1 {
    margin-top: 1rem;
    padding-left: 12rem;
    line-height: 1.5;
  }

  .genres {
    list-style: none;
    margin: 0;
    padding-left: 12rem;
    display: flex;
    flex-wrap: wrap;
  }

  .genres li {
    font-size: 11px;
    border: 1px solid #a4a4a4;
    border-radius: 8px;
    padding: 3px 6px;
    margin: 3px;
    color: #a4a4a4;
  }
</style>
