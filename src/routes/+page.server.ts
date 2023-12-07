import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    const response = await fetch('https://preview-api.water.noaa.gov/v1/gauges/TLMO3/stageflow');
    const data = await response.json();
    const response2 = await fetch('https://preview-api.water.noaa.gov/v1/gauges/TLMO3');
    const data2 = await response2.json();

    return {
        data,
        data2
    };
};