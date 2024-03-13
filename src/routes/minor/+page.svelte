<script lang="ts">
    import Loading from '$lib/components/loading.svelte';

    import { groupByState } from '$lib/helpers/groupByState';

    import StateTitle from '$lib/components/stateTitle.svelte';
	import { onMount } from 'svelte';
	
    import { loading } from '$lib/helpers/loading';

    loading.set(true);
    let gauges: any;
    let hasActionFloods = false;
    let hasMinorFloods = false;

    import { writable } from 'svelte/store';
	import FloodCard2 from '$lib/components/floodCard2.svelte';

    let loadingPercentage = writable(0);
    let intervalId;
    let errorMessage: string;

   onMount(async () => {
    try {
        loadingPercentage.set(10);
    //     intervalId = setInterval(() => {
    // if ($loadingPercentage < 85) {
    //     loadingPercentage.update(n => n + 3);
    // }
    // }, 1000);

        const response = await fetch('https://preview-api.water.noaa.gov/nwps/v1/gauges');
	    const data = await response.json();

        // clearInterval(intervalId);
        loadingPercentage.set(90);

	    const filteredGauges = data.gauges.filter((gauge: any) => {
		const observed = gauge.status?.observed;
		if (observed) {
			const floodCategory = observed.floodCategory;
			return floodCategory === 'action' || floodCategory === 'minor';
			//return floodCategory === 'major' || floodCategory === 'moderate';
		}
        loadingPercentage.set(92);
		return false;
	});
        loadingPercentage.set(94);
        gauges = filteredGauges;
	//     gauges = await Promise.all(
	// 	filteredGauges.map(async (gauge: any) => {
	// 	const gaugeResponse = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${gauge.lid}`);
    //     const gaugeData = await gaugeResponse.json();
    //     loadingPercentage.set(96);
    //     const stageflowResponse = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${gauge.lid}/stageflow`);
    //     const stageflowData = await stageflowResponse.json();
    //     loadingPercentage.set(98);    
    //     //console.log(stageflowData);

    //     if (stageflowData && stageflowData.observed) {
    //       const issuedTime = new Date(stageflowData.observed.issuedTime);
    //       const threeDaysAgo = new Date();
    //       threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    //       if (issuedTime > threeDaysAgo) {
    //         return { ...gaugeData, stageflow: stageflowData };
    //       }
    //     }
    //     return null;
    //   })
    // );
    
    loadingPercentage.set(99);
    // Filter out null values (gauges older than 3 days)
    // gauges = gauges.filter((gauge: any) => gauge !== null);

    hasActionFloods = gauges.some((gauge: { status: { observed: { floodCategory: string; }; }; }) => gauge.status?.observed?.floodCategory === 'action');
    hasMinorFloods = gauges.some((gauge: { status: { observed: { floodCategory: string; }; }; }) => gauge.status?.observed?.floodCategory === 'minor');

    }
    catch (error) {
        console.log((error as Error).message);
        if (error instanceof Error) errorMessage = "Apologies for the inconvenience. The NWPS API is undergoing planned maintenance. We will be back online March 16th. Thank you for your patience and understanding!";
    } finally {
        loadingPercentage.set(100);
        loading.set(false);
    }
   });

</script>

    <div class="mx-auto p-8 text-center text-white">
        <div class="text-3xl mb-4">US Flood Forecasting Dashboard</div>
        <div class="text-2xl p-2">Showing: Current 
            <span class="bg-yellow-300 p-1 rounded-md text-black">Minor</span> 
                and/or 
            <span class="bg-blue-400 p-1 rounded-md text-black">Action Level</span>
                Flooding</div>
            <hr class="w-3/5 mx-auto">
            <br>
            <div class="w-4/5 text-sm mx-auto">
                <strong>Disclaimer:</strong> This dashboard is independently developed and is not affiliated with the National Oceanic and Atmospheric Administration (NOAA) or the National Water Prediction Service. It utilizes a preview version of NOAA's API, which may present data that is not current or accurate. As such, the information provided here should NOT be used for making decisions. Use at your own discretion. We advise consulting official sources for accurate and up-to-date information:
                <a class="font-semibold" href="https://water.noaa.gov/">Office of Water Prediction</a>
            </div>
            
        </div>
    {#if $loading}
    <Loading percentage={$loadingPercentage}/>
    {:else}
    {#if !hasActionFloods && !errorMessage}
    <div class="mx-auto p-4 text-center text-white text-xl">No <span class="bg-blue-400 p-1 rounded-md text-black">Action Level</span> Floods Found</div> 
    {/if}
    {#if !hasMinorFloods && !errorMessage}
    <div class="mx-auto p-4 text-center text-white text-xl">No <span class="bg-yellow-300 p-1 rounded-md">Minor</span> Floods Found</div> 
    {/if}
    {#if errorMessage}
    <div class="mx-auto p-4 text-center text-white text-xl">{errorMessage}</div>
    {/if}
    <div class="text-white mx-auto text-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3">
        {#if gauges}
            {#each gauges as gauge (gauge.lid)}
            <FloodCard2 data={gauge} />
            {/each}
        {/if}
    </div>
    {/if}