<script lang="ts">

	import { groupByState } from '$lib/helpers/groupByState';

	import FloodCard from '$lib/components/floodCard.svelte';
	

	export let data: any;

	const groupedGauges = groupByState(data.gauges);


</script>

<div class="mx-auto p-8 text-center text-white">
	<div class="text-3xl mb-4">River Forecasting Dashboard</div>
		<FloodCard data={groupedGauges} />
</div>
