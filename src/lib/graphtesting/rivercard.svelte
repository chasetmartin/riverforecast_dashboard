<script lang="ts">
	import { Chart } from 'frappe-charts';

	const data = {
		labels: [
			'12am-3am',
			'3am-6pm',
			'6am-9am',
			'9am-12am',
			'12pm-3pm',
			'3pm-6pm',
			'6pm-9pm',
			'9am-12am'
		],
		datasets: [
			{
				name: 'Some Data',
				chartType: 'bar',
				values: [25, 40, 30, 35, 8, 52, 17, -4]
			},
			{
				name: 'Another Set',
				chartType: 'line',
				values: [25, 50, -10, 15, 18, 32, 27, 14]
			}
		]
	};

	let myChart;

	import { onMount } from 'svelte';
	onMount(() => {
		myChart = new Chart('#myChart', {
			title: 'My Awesome Chart',
			data: data,
			type: 'axis-mixed', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
			height: 250,
			colors: ['#7cd6fd', '#743ee2']
		});
	});
</script>

<div class="outline rounded-lg shadow-xl bg-white">
	<div id="myChart"></div>
</div>
