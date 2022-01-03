<script>
  import { onMount } from 'svelte';

  import autoComplete from '@tarekraafat/autocomplete.js';

  export let token;

  let value = '';
  let inputRef;

  onMount(() => {
    new autoComplete({
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
  });

  const updateValue = ({ detail }) => {
    value = detail.selection.value.name;
    inputRef.blur();
  };
</script>

<input
  id="autoComplete"
  bind:this={inputRef}
  bind:value
  on:selection
  on:selection={updateValue}
/>

<style>
  input {
    margin: auto;
    padding: 0.5rem;
    width: 20rem;
  }

  :global(#autoComplete_list_1) {
    position: absolute;
    list-style: none;
    left: 50%;
    transform: translate(-50%, 3.5rem);
    padding: 0 0.5rem;
    margin: 0;
    width: 20rem;
    font-size: 12px;
  }

  :global(#autoComplete_list_1 li) {
    padding: 0.75rem;
    width: calc(100% - 1.75rem);
    border: 1px solid #8f8f9d;
    border-top: none;
    background: white;
  }

  :global(#autoComplete_list_1 li:hover) {
    background: #f2f2f2;
    cursor: pointer;
  }

  :global(#autoComplete_list_1 li:first-of-type) {
    border-top: 1px solid #8f8f9d;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  :global(#autoComplete_list_1 li:last-of-type) {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
