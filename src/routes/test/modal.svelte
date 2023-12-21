<script lang="ts">
	export let modal: HTMLDialogElement
</script>

<dialog class="mx-auto w-3/5 p-8 outline rounded-3xl shadow-xl text-black pt-4 bg-slate-100" bind:this={modal} on:close>
	<slot />
</dialog>

<style>

	dialog::backdrop {
		background-color: hsl(0 0% 0% / 40%);
	}
</style>