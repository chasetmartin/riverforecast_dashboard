<script lang="ts">
    import FloodCard from "./floodCard.svelte";
	import FloodCard2 from "./floodCard2.svelte";

    export let data: any;
    // console.log(data);
</script>

{#each Object.keys(data) as state}
		<div class="grid grid-cols-1 gap-2 my-auto">
            <div class="font-extralight">{state}</div>
            <FloodCard2 data={data[state]} />
        </div>
{/each}