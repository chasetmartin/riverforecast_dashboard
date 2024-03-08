<script>
    import { onMount } from "svelte";

    
    /**
	 * @type {{ lid: any; county: any; latitude: any; longitude: any; name: any; state: any; }}
	 */
    let selectedData;
    onMount(async () => {

        // const response = await fetch('https://preview-api.water.noaa.gov/nwps/v1/gauges');
	    // const data = await response.json();
    

        const response = await fetch('https://preview-api.water.noaa.gov/nwps/v1/gauges/BKFC3');
        const gaugedata = await response.json();
        selectedData = {
            lid: gaugedata.lid,
            county: gaugedata.county,
            latitude: gaugedata.latitude,
            longitude: gaugedata.longitude,
            name: gaugedata.name,
            state: gaugedata.state
        };
        
    });
</script>

<h1>Gauges</h1>
<div>
    {#if selectedData}
        <pre>{JSON.stringify(selectedData, null, 2)},</pre>
    {:else}
        <p>Loading...</p>
    {/if}
</div>