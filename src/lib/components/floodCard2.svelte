<script lang="ts">
    import { goto, preloadData, pushState } from '$app/navigation';
	import { page } from '$app/stores';
    import { allGauges } from '$lib/helpers/allGauges';

    import Modal from '$lib/components/modal.svelte';
	import Guage from '../../routes/[id]/+page.svelte';

    export let data: any;
    let gauge = data;
    //console.log(data);

    //Get gauge name
    function getGaugeName(lid: string) {
        const gauge = allGauges.find(g => g.lid === lid);
        return gauge ? gauge.name : lid;
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

<div class="">
    <!-- {#each data as gauge} -->
    <div class="outline rounded-3xl shadow-xl text-black pt-4 pb-6 mb-2 bg-slate-100">
        <h3 class="p-2 font-bold">{getGaugeName(gauge.lid)}</h3>
        <div class="p-2">Current Observation: {gauge.status.observed.primary} feet</div>
        <div class={`p-2 w-3/5 mb-4 rounded-md mx-auto ${
            gauge.status.observed.floodCategory === 'major' ? 'bg-red-700 text-white' : 
            gauge.status.observed.floodCategory === 'moderate' ? 'bg-orange-400' : 
            gauge.status.observed.floodCategory === 'minor' ? 'bg-yellow-400' :
            gauge.status.observed.floodCategory === 'action' ? 'bg-blue-400' : 'bg-slate-400'
        }`}>
        Flood Category: {gauge.status.observed.floodCategory}</div>
        <a
            on:click|preventDefault={showModal}
            class="outline rounded-md p-2 hover:bg-slate-400"
            href="/{gauge.lid}">Click for more details</a
        >

        <br />
        </div>
    <!-- {/each} -->
</div>