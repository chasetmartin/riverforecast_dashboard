<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    export let data: any;

    // Process the API data and create chart datasets
    const observedData = data?.data?.observed?.data || [];
    const forecastData = data?.data?.forecast?.data || [];

    // Calculate the date 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Filter data for the past 5 days
    const filteredObservedData = observedData
        .filter((entry: { validTime: string | number | Date; }) => new Date(entry.validTime) >= fiveDaysAgo && new Date(entry.validTime).getMinutes() === 0);

    const observedLabels = filteredObservedData.map(entry => entry.validTime);
    const forecastLabels = forecastData.map(entry => entry.validTime);

    const chartLabels = observedLabels.concat(forecastLabels);

    const observedValues = filteredObservedData.map((entry: { secondary: number; }) => entry.secondary * 1000);
    const forecastValues = forecastData.map((entry: { secondary: number; }) => entry.secondary * 1000);
    // Pad the forecast dataset with null values to match the length of the observed dataset
    // const forecastValues = Array(filteredObservedData.length).fill(null).concat(forecastData.map((entry: { secondary: number; }) => entry.secondary * 1000));
    
    const addendedValues = observedValues.concat(forecastValues);

    const svgWidth = 700;
    const svgHeight = 400;
    const margin = { top: 30, right: 5, bottom: 70, left: 150 };

    onMount(() => {
        const svg = d3.select('#myChart')
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xScale = d3.scaleLinear()
      .domain([0, addendedValues.length - 1])
      .range([margin.left, svgWidth - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(addendedValues)])
      .range([svgHeight - margin.bottom, margin.top]);

    const observedLine = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

      svg.append('path')
    .data([observedValues])
    .attr('d', observedLine)
    .attr('stroke', '#7cd6fd')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('class', 'line')
    .each(function () {
      // Animate the line drawing
      const totalLength = this.getTotalLength();
      d3.select(this)
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0);
    });

    const forecastLine = d3.line()
      .x((d, i) => xScale(i + observedValues.length))
      .y(d => yScale(d));

      svg.append('path')
    .data([forecastValues])
    .attr('d', forecastLine)
    .attr('stroke', '#fca130')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('class', 'line')
    .each(function () {
      // Animate the line drawing
      const totalLength = this.getTotalLength();
      d3.select(this)
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0);
    });

    const dots = svg.selectAll('.dot')
        .data(addendedValues)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 3.5)
        .attr('cx', (d, i) => xScale(i))
        .attr('cy', d => yScale(d))
        .style('fill', (d, i) => i < observedValues.length ? '#7cd6fd' : '#fca130')
        .style('opacity', 0) // Initial opacity set to 0
      .on('mouseover', function (event, d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`Value: ${d}`)
          .style('left', (event.x) + 'px')
          .style('top', (event.y - 28) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).style('fill', (d, i) => i < observedValues.length ? '#7cd6fd' : '#fca130'); // Restore color on mouseout
        tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      })
      .transition()
      .duration(4000)
      .style('opacity', 1) // Fade in the dots'
      .style('cursor', 'pointer')

    const tooltip = d3.select('#myChart')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

      svg.append('g')
  .attr('transform', `translate(0, ${svgHeight - margin.bottom})`)
  .call(d3.axisBottom(xScale)
    .tickFormat((d, i) => chartLabels[i])
  )
  .selectAll('text')
  .attr('transform', 'rotate(-45)')
  .style('text-anchor', 'end');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

      svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 3)
      .attr('x', -svgHeight / 2)
      .attr('dy', '0.5em')
      .style('text-anchor', 'middle')
      .text('Cubic Feet per Second (CFS)');

    svg.append('text')
      .attr('x', svgWidth / 2)
      .attr('y', svgHeight - (margin.bottom) / 3)
      .style('text-anchor', 'middle')
      .text('Time');

    // CSS Animation
    // svg.style('opacity', 0)
    //   .transition()
    //   .duration(1500)
    //   .style('opacity', 1);
    });
</script>

<div class="mx-auto p-8 text-center text-white">
    <h1 class="text-3xl">NW River Forecasting Dashboard</h1>
    <div class="grid sm:grid-cols-1 md:grid-cols-2 p-6 gap-3">
        <div class="outline rounded-lg shadow-xl bg-white text-black">
            <div class="text-black" id="myChart"></div>
        </div>
    </div>
</div>

<style>
    .tooltip {
        cursor: pointer;
      position: absolute;
      text-align: center;
      width: 60px;
      height: 28px;
      padding: 2px;
      font: 12px sans-serif;
      background: lightsteelblue;
      border: 0px;
      border-radius: 8px;
      pointer-events: none;
    }


  </style>