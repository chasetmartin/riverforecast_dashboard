<script lang="ts">
    export let data: any;

    console.log(data);

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
    function findStatement(gauge: { flood: { impacts: string | any[]; }; status: { observed: { primary: number; }; }; }) {
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

        return closestImpact ? closestImpact.statement : "no flood statement";
    }
</script>

{#each Object.keys(groupedGauges) as state}
    <h1>{state}</h1>
    {#each groupedGauges[state] as gauge}
        <h2>{gauge.lid}</h2>
        <h3>{gauge.name}</h3>
        <h4>Flood Category: {gauge.status.observed.floodCategory}</h4>
            <!-- {#if gauge.flood.impacts[0] && gauge.flood.impacts[0].stage}
                {#if gauge.status.observed.primary >= gauge.flood.impacts[0].stage }
                    <p>{gauge.flood.impacts[0].statement}</p>
                {/if}
            {/if} -->
            <p>{findStatement(gauge)}</p>
        <br>
    {/each}
    <hr>
{/each}


