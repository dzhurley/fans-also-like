<script>
  import { onMount } from 'svelte';

  import autoComplete from '@tarekraafat/autocomplete.js';

  export let token;

  let value = '';
  let inputRef;
  let autoCompleteInstance;

  onMount(() => {
    autoCompleteInstance = new autoComplete({
      data: {
        src: async query => {
          try {
            const url = `/search?q=${query}&token=${token}`;
            return fetch(url).then(r => r.json());
          } catch (error) {
            return error;
          }
        },
        keys: ['name'],
      },
      debounce: 100,
      wrapper: false,
    });
    inputRef.focus();
  });

  const updateValue = ({ detail }) => {
    value = detail.selection.value.name;
    inputRef.blur();
  };

  const clear = () => {
    value = '';
    autoCompleteInstance.close();
    inputRef.focus();
  };
</script>

<section>
  <input
    id="autoComplete"
    bind:this={inputRef}
    bind:value
    on:selection
    on:selection={updateValue}
  />

  {#if value}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      on:click={clear}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  {/if}
</section>

<style>
  section {
    margin: 0.5rem auto;
    width: 20rem;
    position: relative;
  }

  input {
    margin: auto;
    padding: 0.5rem;
    width: 100%;
  }

  svg {
    position: absolute;
    top: 0.5rem;
    right: -0.5rem;
    cursor: pointer;
  }
</style>
