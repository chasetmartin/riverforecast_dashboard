import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    const response = await fetch('https://preview-api.water.noaa.gov/v1/gauges/TLMO3/stageflow');
    const data = await response.json();

    return {
        data
    };
};