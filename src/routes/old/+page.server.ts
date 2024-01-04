import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const response = await fetch('https://preview-api.water.noaa.gov/v1/gauges/CRAR1/stageflow');
	const data = await response.json();
	const response2 = await fetch('https://preview-api.water.noaa.gov/v1/gauges/CRAR1');
	const data2 = await response2.json();

	// const response3 = await fetch('https://preview-api.water.noaa.gov/v1/gauges');
	// const data3 = await response.json();

	// const filteredData = data.gauges.filter((gauge: any) => {
	//     const floodCategory = gauge.status.observed.floodCategory;
	//     return floodCategory === 'action' || floodCategory === 'minor' || floodCategory === 'major';
	// });

	return {
		data,
		data2
	};
};
