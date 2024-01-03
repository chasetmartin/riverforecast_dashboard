<script lang="ts">
	import { goto, preloadData, pushState } from '$app/navigation';

	import Modal from './modal.svelte';

	import Guage from './[id]/+page.svelte';
	import { page } from '$app/stores';

	export let data: any;

	// Helper function to group the gauges by state
	function groupByState(gauges: any[]) {
		return gauges.reduce((groups, gauge) => {
			const state = gauge.state.name;
			if (!groups[state]) {
				groups[state] = [];
			}
			groups[state].push(gauge);
			return groups;
		}, {});
	}

	const groupedGauges = groupByState(data.gauges);

	// Helper function to find the appropriate statement
	function findStatement(gauge: {
		flood: { impacts: string | any[] };
		status: { observed: { primary: number } };
	}) {
		if (!gauge.flood || !gauge.flood.impacts) {
			return null;
		}

		let closestImpact = null;

		for (let i = 0; i < gauge.flood.impacts.length; i++) {
			const impact = gauge.flood.impacts[i];
			if (impact && gauge.status.observed.primary >= impact.stage) {
				if (!closestImpact || impact.stage > closestImpact.stage) {
					closestImpact = impact;
				}
			}
		}

		return closestImpact ? closestImpact.statement : 'no flood statement';
	}

	async function showModal(e: MouseEvent) {
		//get url
		const { href } = e.currentTarget as HTMLAnchorElement;

		//get result of load function
		const result = await preloadData(href);

		//create new history entry
		if (result.type === 'loaded' && result.status === 200) {
			pushState(href, { selected: result.data });
			modal.showModal();
		} else {
			goto(href);
		}
	}

	let modal: HTMLDialogElement;

	function closeModal() {
		history.back();
	}
</script>

<Modal bind:modal on:close={closeModal}>
	{#if $page.state.selected}
		<Guage data={$page.state.selected} />
	{/if}
</Modal>

<div class="mx-auto p-8 text-center text-white">
	<div class="text-3xl mb-4">River Forecasting Dashboard</div>
	{#each Object.keys(groupedGauges) as state}
		<div>{state}</div>
		<div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-3">
			{#each groupedGauges[state] as gauge}
				<div class="outline rounded-3xl shadow-xl text-black pt-4 bg-slate-100">
					<h3 class="p-2">{gauge.name}</h3>
					<div class="p-2">Current Observation: {gauge.status.observed.primary} feet</div>
					<div class="p-2">Flood Category: {gauge.status.observed.floodCategory}</div>
					<a
						on:click|preventDefault={showModal}
						class="outline rounded-md p-2 hover:bg-slate-400"
						href="/test/{gauge.lid}">Click to Expand</a
					>
					<p class="p-2">{findStatement(gauge)}</p>
					<br />
				</div>
			{/each}
		</div>
	{/each}
</div>
