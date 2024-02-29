export async function load({ fetch, params }) {
	const response2 = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${params.id}`);
	const data2 = await response2.json();
	const response = await fetch(`https://preview-api.water.noaa.gov/nwps/v1/gauges/${params.id}/stageflow`);
	const data = await response.json();

	return {
		gauge: data2,
		flow: data
	};
}
