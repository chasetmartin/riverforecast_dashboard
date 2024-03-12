<script lang="ts">
    import { onMount } from "svelte";

    let responses: any;

    onMount(async () => {

        const response1 = await fetch('https://preview-api.water.noaa.gov/nwps/v1/gauges');
	    const data = await response1.json();
        const allLids= data.gauges;
        
            responses = await Promise.all(
            allLids.slice(11001, 11062).map(async (gauge: any) => {
		        const gaugeResponse = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${gauge.lid}`);
                const gaugeData = await gaugeResponse.json();
                return {
                    lid: gaugeData.lid,
                    name: gaugeData.name,
                    state: gaugeData.state,
                    latitude: gaugeData.latitude,
                    longitude: gaugeData.longitude
                }
            }
            )
        );
        return responses;
    });
</script>

<h1>Gauges</h1>
<div>
    {#if responses}
        <pre>{JSON.stringify(responses)},</pre>
    {:else}
        <p>Loading...</p>
    {/if}
</div>