<script>
  import { ascending } from 'd3-array';
  import { cluster, hierarchy } from 'd3-hierarchy';
  import { curveBundle, lineRadial } from 'd3-shape';

  export let artists = {};
  export let onClick;

  let data;
  let root;
  let width;

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

  $: tree = cluster().size([2 * Math.PI, width / 2 - 100]);

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

  $: {
    data = transformData(artists);

    root = tree(
      bilink(
        hierarchy(data).sort(
          (a, b) =>
            ascending(a.height, b.height) || ascending(a.data.id, b.data.id),
        ),
      ),
    );
  }

  $: viewBox = [-width / 2, -width / 2, width, width];
</script>

<svelte:window bind:innerWidth={width} />

<svg {viewBox}>
  <g class="nodes">
    {#each root.leaves() as d (d.data.id)}
      <g
        transform={`rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`}
      >
        <text
          on:click={() => {
            console.log(d.data.id, artists);
            onClick(artists[d.data.id]);
          }}
          dy="0.31em"
          x={d.x < Math.PI ? 6 : -6}
          text-anchor={d.x < Math.PI ? 'start' : 'end'}
          transform={d.x >= Math.PI ? 'rotate(180)' : null}>{d.data.id}</text
        ></g
      >
    {/each}
  </g>

  <g class="links">
    {#each root.leaves().flatMap(leaf => leaf.outgoing) as [incoming, outgoing]}
      <path d={line(incoming.path(outgoing))} />
    {/each}
  </g>
</svg>

<style>
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
</style>
