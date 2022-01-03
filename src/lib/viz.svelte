<script>
  /* much taken from https://observablehq.com/@d3/bilevel-edge-bundling */
  import { ascending } from 'd3-array';
  import { cluster, hierarchy } from 'd3-hierarchy';
  import { curveBundle, lineRadial } from 'd3-shape';

  export let artists = {};
  export let onClick;

  let data;
  let root;
  let width;
  let height;

  const transformData = artists => {
    const groupById = new Map();

    Object.values(artists).forEach(({ name, group, targets }) => {
      let currentGroup = groupById.get(group);
      if (!currentGroup) {
        currentGroup = { id: group, children: [] };
        groupById.set(group, currentGroup);
      }

      currentGroup.children.push({ id: name, group, targets });
    });

    return { children: [...groupById.values()] };
  };

  const line = lineRadial()
    .curve(curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x);

  const bilink = root => {
    const leaves = root.leaves();
    if (leaves) {
      const map = new Map(leaves.map(d => [d.data.id, d]));
      for (const d of leaves) {
        d.incoming = [];
        d.outgoing = d.data?.targets?.map(i => [d, map.get(i)]) ?? [];
      }
      for (const d of leaves) {
        for (const o of d.outgoing) {
          o[1].incoming.push(o);
        }
      }
    }
    return root;
  };

  $: size = Math.min(width, height);

  $: viewBox = [-size / 2, -size / 2, size, size];

  $: {
    data = transformData(artists);

    let tree = cluster().size([2 * Math.PI, size / 2 - 200]);

    root = tree(bilink(hierarchy(data)));
  }

  let hovered = false;
  let hoveredLinks = [];
  let links = [];

  $: links = root
    .leaves()
    .flatMap(leaf => leaf.outgoing)
    .map(([incoming, outgoing]) => {
      const active = hoveredLinks.some(
        ([src, dest]) =>
          (src === incoming.data.id && dest === outgoing.data.id) ||
          (dest === incoming.data.id && src === outgoing.data.id),
      );
      return [incoming, outgoing, active];
    })
    .sort((a, b) => (a[2] && !b[2] ? 1 : -1));
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if root.height > 0}
  <svg {viewBox} class:hovered>
    <g class="nodes">
      {#each root.leaves() as d (d.data.id)}
        <g
          transform={`rotate(${(d.x * 180) / Math.PI - 90}) translate(${
            d.y
          },0)`}
        >
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <text
            on:click={() => onClick(artists[d.data.id])}
            on:mouseover={() => {
              hovered = true;
              const addLink = ([src, dest]) => {
                hoveredLinks = [...hoveredLinks, [src.data.id, dest.data.id]];
              };
              d.incoming.map(addLink);
              d.outgoing.map(addLink);
            }}
            on:mouseout={() => {
              hovered = false;
              hoveredLinks = [];
            }}
            x={d.x < Math.PI ? 6 : -6}
            y={4}
            text-anchor={d.x < Math.PI ? 'start' : 'end'}
            transform={d.x >= Math.PI ? 'rotate(180)' : null}>{d.data.id}</text
          ></g
        >
      {/each}
    </g>

    <g class="links">
      {#each links as [incoming, outgoing, active]}
        <path d={line(incoming.path(outgoing))} class:active />
      {/each}
    </g>
  </svg>
{/if}

<style>
  svg {
    font-size: 12px;
    width: 100%;
    height: 100%;
  }

  .nodes text {
    font-family: Consolas, Monaco, monospace;
    fill: #839496;
    cursor: pointer;
  }

  .links {
    stroke: #839496;
    fill: none;
  }

  .links path {
    mix-blend-mode: multiply;
  }

  .hovered .links path {
    mix-blend-mode: unset;
    z-index: 1;
  }

  .links path.active {
    stroke: black;
    stroke-width: 2px;
    z-index: 10;
  }
</style>
