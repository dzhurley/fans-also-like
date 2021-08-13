<script>
  import { onMount } from 'svelte';

  import autoComplete from '@tarekraafat/autocomplete.js';

  export let token;

  export let selection = null;

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
      resultItem: {
        highlight: {
          render: true,
        },
      },
      wrapper: false,
    });
  });

  const select = event => (selection = event.detail.selection.value);
</script>

<input id="autoComplete" on:selection={select} />
