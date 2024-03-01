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

   onMount(async () => {
    try {
        const response = await fetch('https://preview-api.water.noaa.gov/nwps/v1/gauges');
	    const data = await response.json();

	    const filteredGauges = data.gauges.filter((gauge: any) => {
		const observed = gauge.status?.observed;
		if (observed) {
			const floodCategory = observed.floodCategory;
			return floodCategory === 'action' || floodCategory === 'minor';
			// return floodCategory === 'major' || floodCategory === 'moderate';
		}
		return false;
	});

	    gauges = await Promise.all(
		filteredGauges.map(async (gauge: any) => {
		const gaugeResponse = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${gauge.lid}`);
        const gaugeData = await gaugeResponse.json();

        const stageflowResponse = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${gauge.lid}/stageflow`);
        const stageflowData = await stageflowResponse.json();

        console.log(stageflowData);

        if (stageflowData && stageflowData.observed) {
          const issuedTime = new Date(stageflowData.observed.issuedTime);
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

          if (issuedTime > threeDaysAgo) {
            return { ...gaugeData, stageflow: stageflowData };
          }
        }
        return null;
      })
    );
    

    // Filter out null values (gauges older than 3 days)
    gauges = gauges.filter((gauge: any) => gauge !== null);

    hasActionFloods = gauges.some((gauge: { status: { observed: { floodCategory: string; }; }; }) => gauge.status?.observed?.floodCategory === 'action');
    hasMinorFloods = gauges.some((gauge: { status: { observed: { floodCategory: string; }; }; }) => gauge.status?.observed?.floodCategory === 'minor');

    }
    catch {
        console.log('error');
    } finally {
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
    <Loading />
    {:else}
    {#if !hasActionFloods}
    <div class="mx-auto p-4 text-center text-white text-xl">No <span class="bg-blue-400 p-1 rounded-md text-black">Action Level</span> Floods Found</div> 
    {/if}
    {#if !hasMinorFloods}
    <div class="mx-auto p-4 text-center text-white text-xl">No <span class="bg-yellow-300 p-1 rounded-md">Minor</span> Floods Found</div> 
    {/if}
    <div class="text-white mx-auto text-center grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-3 gap-3">
        <StateTitle data={groupByState(gauges)} />   
    </div>
    {/if}