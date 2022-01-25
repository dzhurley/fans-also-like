<script>
  /* much taken from https://observablehq.com/@d3/bilevel-edge-bundling */
  import { ascending } from 'd3-array';
  import { cluster, hierarchy } from 'd3-hierarchy';
  import { curveBundle, lineRadial } from 'd3-shape';

  import { fade } from 'svelte/transition';

  export let artists = {};
  export let onClick;

  let data;
  let root;
  let width;
  let height;

  const transformData = artists => {
    const groupById = new Map();

    Object.values(artists).forEach(({ color, name, group, targets }) => {
      let currentGroup = groupById.get(group);
      if (!currentGroup) {
        currentGroup = { id: group, children: [] };
        groupById.set(group, currentGroup);
      }

      currentGroup.children.push({ color, id: name, group, targets });
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

  let hovering = null;
  let hoveredPairs = [];
  let links = [];
  let hoveredLinks = [];

  $: {
    const newHoveredLinks = [];
    links = root
      .leaves()
      .flatMap(leaf => leaf.outgoing)
      .map(link => {
        const active = hoveredPairs.some(
          ([src, dest]) =>
            (src === link[0].data.id && dest === link[1].data.id) ||
            (dest === link[0].data.id && src === link[1].data.id),
        );
        if (active) {
          newHoveredLinks.push(link);
        }
        return link;
      });
    hoveredLinks = newHoveredLinks;
  }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

{#if root.height > 0}
  <svg {viewBox} class:hovering>
    <g class="links">
      {#each links as [incoming, outgoing]}
        <path d={line(incoming.path(outgoing))} />
      {/each}
    </g>

    <g class="links">
      {#each hoveredLinks as [incoming, outgoing]}
        <path d={line(incoming.path(outgoing))} class="active" />
      {/each}
    </g>

    <g class="nodes">
      {#each root.leaves() as d (d.data.id)}
        <g
          transform={`rotate(${(d.x * 180) / Math.PI - 90}) translate(${
            d.y
          },0)`}
        >
          {#if d.data.id === hovering?.id}
            <rect
              fill={d.data.color}
              rx="5"
              x="-2"
              y={-(hovering.height + 8) / 2}
              width={hovering.width + 14}
              height={hovering.height + 8}
            />
          {/if}

          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <text
            class:hovering={d.data.id === hovering?.id}
            on:click={() => onClick(artists[d.data.id])}
            on:mouseover={evt => {
              const { width, height } = evt.target.getBBox();
              hovering = { id: d.data.id, width, height };
              const addLink = ([src, dest]) => {
                hoveredPairs = [...hoveredPairs, [src.data.id, dest.data.id]];
              };
              d.incoming.map(addLink);
              d.outgoing.map(addLink);
            }}
            on:mouseout={() => {
              hovering = null;
              hoveredPairs = [];
              hoveredLinks = [];
            }}
            x={d.x < Math.PI ? 6 : -6}
            y={4}
            fill={d.data.color}
            text-anchor={d.x < Math.PI ? 'start' : 'end'}
            transform={d.x >= Math.PI ? 'rotate(180)' : null}>{d.data.id}</text
          ></g
        >
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

  .nodes rect {
    cursor: pointer;
  }

  .nodes text {
    font-family: Consolas, Monaco, monospace;
    cursor: pointer;
  }

  .nodes text.hovering {
    font-family: Consolas, Monaco, monospace;
    fill: white;
    cursor: pointer;
  }

  .links {
    fill: none;
    stroke: #c2c9ca;
  }

  .links path {
    mix-blend-mode: multiply;
  }

  .hovering .links path {
    mix-blend-mode: unset;
  }

  .links path.active {
    stroke-width: 3px;
    stroke: #839496;
  }
</style>
