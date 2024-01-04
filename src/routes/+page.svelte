<script lang="ts">

	import { groupByState } from '$lib/helpers/groupByState';

	import FloodCard from '$lib/components/floodCard.svelte';
	import StateTitle from '$lib/components/stateTitle.svelte';
	

	export let data: any;

	const groupedGauges = groupByState(data.gauges);


</script>

<div class="mx-auto p-8 text-center text-white">
	<div class="text-3xl mb-4">US Flood Forecasting Dashboard</div>
	<div class="text-2xl p-2">Current Major and Moderate Flooding
		<hr class="w-3/5 mx-auto">
	</div>
</div>
	<div class="text-white mx-auto text-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3">
			<StateTitle data={groupedGauges} />
				
	</div>

