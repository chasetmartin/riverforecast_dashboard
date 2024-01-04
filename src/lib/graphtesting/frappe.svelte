<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'frappe-charts';

	export let data: any;

	let myChart;

	// Process the API data and create chart datasets
	const observedData = data?.data?.observed?.data || [];
	const forecastData = data?.data?.forecast?.data || [];

	// Calculate the date 5 days ago
	const fiveDaysAgo = new Date();
	fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

	// Filter data for the past 5 days
	const filteredObservedData = observedData.filter(
		(entry: { validTime: string | number | Date }) =>
			new Date(entry.validTime) >= fiveDaysAgo && new Date(entry.validTime).getMinutes() === 0
	);

	const observedLabels = filteredObservedData.map((entry) => entry.validTime);
	const forecastLabels = forecastData.map((entry) => entry.validTime);

	const chartLabels = observedLabels.concat(forecastLabels);

	const observedValues = filteredObservedData.map(
		(entry: { secondary: number }) => entry.secondary * 1000
	);
	const forecastValues = forecastData.map((entry: { secondary: number }) => entry.secondary * 1000);
	// Pad the forecast dataset with null values to match the length of the observed dataset
	// const forecastValues = Array(filteredObservedData.length).fill(null).concat(forecastData.map((entry: { secondary: number; }) => entry.secondary * 1000));

	const addendedValues = observedValues.concat(forecastValues);

	const chartdata = {
		labels: chartLabels,
		datasets: [
			// {
			//     name: "Observed",
			//     chartType: "line",
			//     values: observedValues,
			//     color: '#7cd6fd' // Use a color for observed values
			// },
			// {
			//     name: "Forecast",
			//     chartType: "line",
			//     values: forecastValues,
			//     color: '#fca130' // Use a different color for forecast values
			// }
			{
				name: 'Cubic Feet per Second (CFS)',
				chartType: 'line',
				values: addendedValues,
				color: '#7cd6fd' // Use a color for observed values
			}
		],
		// yMarkers: [
		//         {
		//             label: "Flood Stage",
		//             value: 15000,
		//             options: { labelPos: 'right' }
		//         }
		//     ],
		yRegions: [
			{
				label: 'Flood',
				start: 15000,
				end: 30000,
				options: { labelPos: 'right' }
			}
		]
	};

	onMount(() => {
		myChart = new Chart('#myChart', {
			title: 'NW River Forecasting',
			data: chartdata,
			type: 'line',
			height: 500,
			colors: ['#7cd6fd', '#743ee2'],
			axisOptions: {
				xIsSeries: true,
				xAxisMode: 'tick'
			},
			lineOptions: {
				spline: 1,
				hideDots: 1,
				heatline: 1,
				regionFill: 1
			}
		});
	});
</script>

<div class="mx-auto p-8 text-center text-white">
	<h1 class="text-3xl">NW River Forecasting Dashboard</h1>
	<div class="grid sm:grid-cols-1 md:grid-cols-2 p-6 gap-3">
		<div class="outline rounded-lg shadow-xl bg-white">
			<div id="myChart"></div>
		</div>
	</div>
</div>
