<script lang="ts">
	export let data: any;

	const gauge = data.gauge;

	// Helper function to find the appropriate statement
	function findStatement(gauge: {
		flood: { impacts: string | any[] };
		status: { observed: { primary: number } };
	}) {
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

		return closestImpact ? closestImpact.statement : 'no flood statement';
	}
</script>

<div>
	<div>
		<h3>{gauge.name}</h3>
		<div>Current Observation: {gauge.status.observed.primary} feet</div>
		<div>Flood Category: {gauge.status.observed.floodCategory}</div>
		<div>Flood Stage Information: {findStatement(gauge)}</div>
	</div>
</div>
