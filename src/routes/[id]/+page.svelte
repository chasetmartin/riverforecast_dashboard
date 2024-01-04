<script lang="ts">
	import { findFloodStatement } from "$lib/helpers/findFloodStatement";

	export let data: any;
	const gauge = data.gauge;

</script>

<div>
	<div>
		<h3>{gauge.name}</h3>
		<div>Current Observation: {gauge.status.observed.primary} feet</div>
		<div>Flood Category: {gauge.status.observed.floodCategory}</div>
		<div>Flood Stage Information: {findFloodStatement(gauge)}</div>
	</div>
</div>
