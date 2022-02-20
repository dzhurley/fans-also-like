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
    inputRef.focus();
  });

  const updateValue = ({ detail }) => {
    value = detail.selection.value.name;
    inputRef.blur();
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
</section>

<style>
  section {
    margin: 0.5rem auto;
    width: 20rem;
  }

  input {
    margin: auto;
    padding: 0.5rem;
    width: 100%;
  }
</style>
