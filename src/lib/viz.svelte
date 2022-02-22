<script>
  /* much taken from https://observablehq.com/@d3/bilevel-edge-bundling */
  import { ascending } from 'd3-array';
  import { cluster, hierarchy } from 'd3-hierarchy';
  import { curveBundle, lineRadial } from 'd3-shape';

  import { fade } from 'svelte/transition';

  import Menu from '$lib/menu.svelte';

  export let artists = {};
  export let infoArtist;
  export let onRelateClick;
  export let onInfoClick;

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

  let nodesEl;
  let nodeSizes = {};

  $: {
    data = transformData(artists);

    let tree = cluster().size([2 * Math.PI, size / 2 - 200]);

    root = tree(bilink(hierarchy(data)));

    setTimeout(() => {
      if (nodesEl) {
        const newNodeSizes = {};
        nodesEl.querySelectorAll('text').forEach(text => {
          const { width, height } = text.getBBox();
          newNodeSizes[text.textContent] = { width, height };
        });
        nodeSizes = newNodeSizes;
      }
    }, 0);
  }

  let hovering = null;
  let clicking = null;
  let hoveredPairs = [];
  let hoveredLinks = [];
  let links = [];

  const resetNodeLinkState = () => {
    hovering = null;
    clicking = null;
    hoveredPairs = [];
    hoveredLinks = [];
  };

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

  $: {
    if (!infoArtist) {
      resetNodeLinkState();
    }
  }

  $: disabled = !!infoArtist || !!clicking;

  const onNodeClick = artist => {
    if (!disabled) {
      clicking = artist;
    } else if (!infoArtist) {
      resetNodeLinkState();
    }
  };

  const onNonNodeClick = evt => {
    if (
      clicking &&
      !infoArtist &&
      !['UL', 'LI'].includes(evt.target.nodeName)
    ) {
      resetNodeLinkState();
    }
  };
</script>

{#if root.height > 0}
  <svg {viewBox} class:hovering class:disabled>
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

    <g class="nodes" bind:this={nodesEl}>
      {#each root.leaves() as d (d.data.id)}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <g
          transform={`rotate(${(d.x * 180) / Math.PI - 90}) translate(${
            d.y
          },0)`}
          on:click|stopPropagation={() => {
            onNodeClick(artists[d.data.id]);
          }}
          on:mouseenter={() => {
            if (!disabled) {
              hovering = d.data.id;
              const addLink = ([src, dest]) => {
                hoveredPairs = [...hoveredPairs, [src.data.id, dest.data.id]];
              };
              d.incoming.map(addLink);
              d.outgoing.map(addLink);
            }
          }}
          on:mouseleave={() => {
            if (!disabled) {
              hovering = null;
              hoveredPairs = [];
              hoveredLinks = [];
            }
          }}
        >
          <rect
            fill={hovering === d.data.id ? d.data.color : 'none'}
            rx="5"
            x="-5"
            y={-((nodeSizes[d.data.id]?.height ?? 0) + 8) / 2}
            width={(nodeSizes[d.data.id]?.width ?? 0) + 20}
            height={(nodeSizes[d.data.id]?.height ?? 0) + 8}
          />
          <text
            class:hovering={d.data.id === hovering}
            x={d.x < Math.PI ? 6 : -6}
            y={4}
            fill={d.data.color}
            text-anchor={d.x < Math.PI ? 'start' : 'end'}
            transform={d.x >= Math.PI ? 'rotate(180)' : null}
          >
            {d.data.id}
          </text>
        </g>
      {/each}
    </g>
  </svg>

  <Menu
    artist={clicking}
    onRelateClick={() => {
      onRelateClick(clicking);
      resetNodeLinkState();
    }}
    onInfoClick={() => {
      onInfoClick(clicking);
      clicking = null;
    }}
  />
{/if}

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svelte:body on:click={onNonNodeClick} />

<style>
  svg {
    font-size: 12px;
    width: 100%;
    height: 100%;
  }

  rect,
  text {
    cursor: pointer;
  }

  .disabled rect,
  .disabled text {
    cursor: default;
  }

  text {
    font-family: Consolas, Monaco, monospace;
  }

  text.hovering {
    font-family: Consolas, Monaco, monospace;
    fill: white;
  }

  .links {
    fill: none;
    stroke: #c2c9ca;
  }

  path {
    mix-blend-mode: multiply;
  }

  .hovering path {
    mix-blend-mode: unset;
  }

  path.active {
    stroke-width: 3px;
    stroke: #839496;
  }
</style>
