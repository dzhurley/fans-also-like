<script>
  import { onMount } from 'svelte';

  import autoComplete from '@tarekraafat/autocomplete.js';

  export let token;

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
</script>

<input id="autoComplete" on:selection />
