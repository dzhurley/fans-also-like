<script context="module">
  /* export async function load({ fetch }) { */
  /*   const res = await fetch(); */
  /*   if (res.ok) { */
  /*     const { data } = await res.json(); */
  /*     return { */
  /*       props: { ... } */
  /*     }; */
  /*   } */

  /*   return { */
  /*     status: res.status, */
  /*     error: new Error(`Error fetching data`) */
  /*   }; */
  /* } */
</script>

<script>
  export let things = [1, 2, 3];
</script>

<h1>Things</h1>

<ul>
  {#each things as thing}
    <li>
      <p>{thing}</p>
    </li>
  {/each}
</ul>

<style>
  :global(body) {
    font-family: Consolas, Monaco, Liberation Mono, Lucida Console, monospace;
    background-color: #fafafa;
    max-width: 650px;
    margin: 32px auto;
    padding: 0 16px;
  }

  h1 {
    letter-spacing: -0.025em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 32px;
  }

  li {
    border: 1px solid #eaeaea;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 0 20px;
    background-color: white;
    transition: 0.15s box-shadow ease-in-out;
  }

  p {
    color: #666;
    font-size: 14px;
    line-height: 1.75;
  }
</style>
