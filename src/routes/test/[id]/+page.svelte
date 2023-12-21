<script lang="ts">
    export let data: any;

    const gauge = data.gauge;
    console.log(data);
</script>

<div>
    <div>
    <h3>{gauge.name}</h3>
    <div>Current Observation: {gauge.status.observed.primary} feet</div>
    <div>Flood Category: {gauge.status.observed.floodCategory}</div>
    </div>
</div>