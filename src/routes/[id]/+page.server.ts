export async function load({ fetch, params }) {
	const response = await fetch(`https://preview-api.water.noaa.gov/v1/gauges/${params.id}`);
	const data = await response.json();

	return {
		gauge: data
	};
}
