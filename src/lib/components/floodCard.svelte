<script lang="ts">
    import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';

    import Modal from '$lib/components/modal.svelte';
	import Guage from '../../routes/[id]/+page.svelte';

    export let data: any;
    const groupedGauges = data;
   
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

<div>
	{#each Object.keys(groupedGauges) as state}
		<div>{state}</div>
		<div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-3">
			{#each groupedGauges[state] as gauge}
				<div class="outline rounded-3xl shadow-xl text-black pt-4 pb-6 bg-slate-100">
					<h3 class="p-2">{gauge.name}</h3>
					<div class="p-2">Current Observation: {gauge.status.observed.primary} feet</div>
					<div class="p-2">Flood Category: {gauge.status.observed.floodCategory}</div>
					<a
						on:click|preventDefault={showModal}
						class="outline rounded-md p-2 hover:bg-slate-400"
						href="/{gauge.lid}">Click for Details</a
					>
					<br />
				</div>
			{/each}
		</div>
	{/each}
</div>