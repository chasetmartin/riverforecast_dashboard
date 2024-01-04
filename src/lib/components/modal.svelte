<script lang="ts">
	export let modal: HTMLDialogElement;

	function closeModal() {
		modal.close();
	}
</script>

<dialog
	class="mx-auto w-3/5 p-8 outline rounded-3xl shadow-xl text-black pt-4 bg-slate-100"
	bind:this={modal}
	on:close
>
	<button
		class="absolute top-0 right-0 mr-4 p-1 text-2xl hover:text-3xl font-semibold text-black bg-transparent"
		on:click={closeModal}>&times;</button
	>
	<slot />
</dialog>

<style>
	dialog::backdrop {
		background-color: hsl(0 0% 0% / 60%);
	}
</style>
