<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'frappe-charts';
	import { max } from 'd3';

	export let data: any;

	let myChart;

	// Process the API data and create chart datasets
	const observedData = data?.data?.observed?.data || [];
	const forecastData = data?.data?.forecast?.data || [];

	// Create an array of timestamps with hourly intervals
	const hourlyTimestamps = [];
	const startDate = new Date(forecastData[0].validTime);
	const endDate = new Date(forecastData[forecastData.length - 1].validTime);

	for (
		let currentTimestamp = startDate;
		currentTimestamp <= endDate;
		currentTimestamp.setHours(currentTimestamp.getHours() + 1)
	) {
		hourlyTimestamps.push(currentTimestamp.toISOString());
	}

	// Map forecast data to hourly intervals and fill missing hours with previous values
	let prevPrimary: any;
	let prevSecondary: any;

	const hourlyForecastData = hourlyTimestamps.map((timestamp) => {
		const matchingEntry = forecastData.find(
			(entry) => new Date(entry.validTime).toISOString() === new Date(timestamp).toISOString()
		);

		if (matchingEntry) {
			// Update previous values for next iteration
			prevPrimary = matchingEntry.primary;
			prevSecondary = matchingEntry.secondary;
			return matchingEntry;
		} else {
			// Use previous values for missing hours
			return { validTime: timestamp, primary: prevPrimary, secondary: prevSecondary };
		}
	});

	// Calculate the date 5 days ago
	const fiveDaysAgo = new Date();
	fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

	// Filter data for the past 5 days
	const filteredObservedData = observedData.filter(
		(entry: { validTime: string | number | Date }) =>
			new Date(entry.validTime) >= fiveDaysAgo && new Date(entry.validTime).getMinutes() === 0
	);

	const observedLabels = filteredObservedData.map((entry) =>
		new Date(entry.validTime).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			timeZone: 'America/Los_Angeles'
		})
	);

	const forecastLabels = hourlyForecastData.map((entry) =>
		new Date(entry.validTime).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			timeZone: 'America/Los_Angeles'
		})
	);

	const chartLabels = observedLabels.concat(forecastLabels);

	const observedValues = filteredObservedData.map((entry: { primary: number }) => entry.primary);

	// Pad the forecast dataset with null values to match the length of the observed dataset
	const forecastValues = Array(filteredObservedData.length)
		.fill(null)
		.concat(hourlyForecastData.map((entry: { primary: number }) => entry.primary));

	// Bar for today
	const todayValues = Array(forecastValues.length).fill(null);
	todayValues[observedValues.length - 1] = observedValues[observedValues.length - 1];

	// Add null values to the end of the observedValues array
	const lengthToAdd = forecastValues.length - observedValues.length;
	observedValues.length += lengthToAdd;
	observedValues.fill(null, observedValues.length - lengthToAdd);

	//Flood stages
	const actionFlood = data?.data2?.flood?.categories?.action?.stage;
	const minorFlood = data?.data2?.flood?.categories?.minor?.stage;
	const moderateFlood = data?.data2?.flood?.categories?.moderate?.stage;
	const majorFlood = data?.data2?.flood?.categories?.major?.stage;

	//River Info
	const riverTitle = data?.data2?.name;

	const chartdata = {
		labels: chartLabels,
		datasets: [
			{
				name: 'Observed',
				chartType: 'bar',
				values: observedValues,
				color: '#7cd6fd' // Use a color for observed values
			},
			{
				name: 'Forecast',
				chartType: 'bar',
				values: forecastValues,
				color: '#ff2b5c'
			},
			{
				name: 'Today',
				chartType: 'bar',
				values: todayValues,
				color: '#f91643'
			}
		],
		yRegions: [
			{
				label: 'Action Level',
				start: 0,
				end: actionFlood,
				options: { labelPos: 'left' }
			},
			{
				label: 'Minor Flood',
				start: actionFlood,
				end: minorFlood,
				options: { labelPos: 'right' }
			},
			{
				label: 'Moderate Flood',
				start: minorFlood,
				end: moderateFlood,
				options: { labelPos: 'right' }
			},
			{
				label: 'Major Flood',
				start: moderateFlood,
				end: majorFlood,
				options: { labelPos: 'right' }
			},
			{
				label: '',
				start: majorFlood,
				end: majorFlood + 2,
				options: { labelPos: 'right' }
			}
		]
	};

	onMount(() => {
		myChart = new Chart('#myChart', {
			data: chartdata,
			type: 'bar',
			height: 500,
			colors: ['#743ee2', '#7cd6fd', '#000'],
			axisOptions: {
				xIsSeries: true,
				xAxisMode: 'tick'
			},
			barOptions: {
				spaceRatio: 0.01
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
		<div class="outline rounded-3xl shadow-xl text-black pt-4 bg-slate-100">
			{riverTitle}
			<div class="p-4" id="myChart"></div>
		</div>
	</div>
</div>
