<script lang="ts">
	import GaugeForecast from "$lib/components/gaugeForecast.svelte";
	import { findFloodStatement } from "$lib/helpers/findFloodStatement";

	export let data: any;
	const gauge = data.gauge;
	const flow = data.flow;

	console.log(flow);


</script>

<div>
	<div>
		<h3>{gauge.name}</h3>
		<div>Current Observation: {gauge.status.observed.primary} feet</div>
		<div>Flood Category: {gauge.status.observed.floodCategory}</div>
		<div>Flood Stage Information: {findFloodStatement(gauge)}</div>
	</div>
</div>
