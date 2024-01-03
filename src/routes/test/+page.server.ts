import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const response = await fetch('https://preview-api.water.noaa.gov/v1/gauges');
	const data = await response.json();

	const filteredGauges = data.gauges.filter((gauge: any) => {
		const observed = gauge.status?.observed;
		if (observed) {
			const floodCategory = observed.floodCategory;
			// return floodCategory === 'action' || floodCategory === 'minor' || floodCategory === 'major';
			return floodCategory === 'major' || floodCategory === 'moderate';
		}
		return false;
	});

	const gaugeDetails = await Promise.all(
		filteredGauges.map(async (gauge: any) => {
			const response = await fetch(`https://preview-api.water.noaa.gov/v1/gauges/${gauge.lid}`);
			return response.json();
		})
	);

	return {
		gauges: gaugeDetails
	};
};
