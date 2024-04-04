<script lang="ts">
	import GaugeForecast from "$lib/components/gaugeForecast.svelte";
	import { findFloodStatement } from "$lib/helpers/findFloodStatement";

	export let data: any;
	const gauge = data.gauge;
	const flow = data.flow;

	console.log(data);

</script>

<div>
	<div>
		<h3>{gauge.name}</h3>
		<div>Current Observation: {gauge.status.observed.primary} feet</div>
		<div>Flood Category: {gauge.status.observed.floodCategory}</div>
		<div>Flood Stage Information: {findFloodStatement(gauge)}</div>
		<div>Issued Date/Time: {flow.observed.issuedTime}</div>
		<div class="mt-4 p-2">
            <span class="font-semibold">Guage Notes</span>
        {#if gauge.hydronotes && gauge.hydronotes.length > 0}
        <div>
        {#each gauge.hydronotes as hydronote}
        <div>
           {hydronote.statement}
        </div>
        <br>
        {/each}
        </div>
        {:else}
        <p>No notes available</p>
        {/if}
        </div>
		<br>
		<a
            class="outline rounded-md p-2 hover:bg-slate-400 text-sm"
            href="https://water.noaa.gov/gauges/{gauge.lid}" target="_blank">Click to check data on NOAA Preview site</a
        >
	</div>
</div>
